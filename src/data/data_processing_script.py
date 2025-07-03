import pandas as pd
import re
import numpy as np
import json
import requests
from bs4 import BeautifulSoup
import time
import sys
import os
from dotenv import load_dotenv

# Make sure to install the Google Maps library: pip3 install googlemaps
try:
    import googlemaps
except ImportError:
    print("FATAL ERROR: The 'googlemaps' library is not installed.")
    print("Please install it by running: pip3 install googlemaps")
    sys.exit(1)

# --- Configuration ---
# FIX: Load environment variables and prioritize the one set by GitHub Actions
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") # This is for the GitHub Action
if not GOOGLE_API_KEY:
    # Fallback for local development using .env file
    GOOGLE_API_KEY = os.getenv("REACT_APP_GOOGLE_MAPS_API_KEY")

LTC_HOMES_FILE = 'Ontario SeniorCare Compass - Long Term Care Homes.csv'
RETIREMENT_HOMES_FILE = 'Ontario SeniorCare Compass - Retirement Homes.csv'
OUTPUT_CSV_FILE = 'senior_care_ontario_homes.csv'
OUTPUT_JS_FILE = 'homesData.js'
PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1740&auto=format&fit=crop'

# --- Custom Parsing and Cleaning Functions ---

def parse_cost_from_string(price_string):
    if not isinstance(price_string, str): return np.nan
    price_string_lower = price_string.lower()
    if 'contact' in price_string_lower or 'call' in price_string_lower: return np.nan
    numbers = re.findall(r'[\d,]+\.?\d*', price_string)
    if numbers:
        try: return float(numbers[0].replace(',', ''))
        except (ValueError, IndexError): return np.nan
    return np.nan

def clean_cost_column(cost_series):
    return pd.to_numeric(cost_series.astype(str).str.replace(r'[$,]', '', regex=True), errors='coerce')

def parse_rating(rating_string):
    if isinstance(rating_string, (int, float)): return float(rating_string)
    if not isinstance(rating_string, str): return np.nan
    numbers = re.findall(r'\d+\.\d+|\d+', rating_string)
    if numbers:
        try: return float(numbers[0])
        except (ValueError, IndexError): return np.nan
    return np.nan

def get_google_place_details(gmaps_client, home_name, address):
    """
    Uses the Google Places API to find a business and retrieve photos, reviews, ratings, and city.
    """
    default_return = {'photos': [], 'reviews': [], 'rating': 0.0, 'review_count': 0, 'city': None}
    if not isinstance(home_name, str) or not home_name.strip():
        return default_return

    print(f"  -> Searching Google Places API for: {home_name}")
    time.sleep(0.1) 

    try:
        find_place_result = gmaps_client.find_place(
            input=f'{home_name} {address}',
            input_type='textquery',
            fields=['place_id']
        )
        
        if not find_place_result['candidates']:
            print(f"     Could not find a match for {home_name}.")
            return default_return

        place_id = find_place_result['candidates'][0]['place_id']

        place_details = gmaps_client.place(
            place_id=place_id,
            fields=['photo', 'review', 'rating', 'user_ratings_total', 'address_component']
        )
        
        result = place_details.get('result', {})
        photos, reviews, city = [], [], None
        rating = result.get('rating', 0.0)
        review_count = result.get('user_ratings_total', 0)

        if 'address_components' in result:
            for component in result['address_components']:
                if 'locality' in component.get('types', []):
                    city = component['long_name']
                    break

        if 'photos' in result:
            for photo in result['photos'][:3]:
                photos.append(f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference={photo['photo_reference']}&key={GOOGLE_API_KEY}")
        
        if 'reviews' in result:
            for review in result['reviews']:
                reviews.append({
                    'user': review.get('author_name'),
                    'rating': review.get('rating'),
                    'date': review.get('relative_time_description'),
                    'snippet': review.get('text')
                })

        return {'photos': photos, 'reviews': reviews, 'rating': rating, 'review_count': review_count, 'city': city}

    except Exception as e:
        print(f"  -> API Error for {home_name}: {e}")
        return default_return


# --- Main Script Execution ---
if __name__ == "__main__":
    if not GOOGLE_API_KEY:
        print("FATAL ERROR: GOOGLE_API_KEY not found.")
        print("Please ensure it's set in your .env file (for local) or as a GitHub Secret (for deployment).")
        sys.exit(1)

    print("Starting data processing script...")
    gmaps = googlemaps.Client(key=GOOGLE_API_KEY)
    
    try:
        ltc_df = pd.read_csv(LTC_HOMES_FILE, encoding='utf-8-sig')
        ret_df = pd.read_csv(RETIREMENT_HOMES_FILE, encoding='utf-8-sig')
        
        ltc_df.rename(columns={'LTC Home Name': 'name', 'Address': 'address', 'City/Town': 'city', 'Postal Code': 'postal_code', 'Phone Number': 'phone', 'Website': 'website', 'Key Amenities': 'amenities', 'Google Rating': 'google_review', 'Description': 'description'}, inplace=True)
        ltc_df['type'] = 'Long Term Care'
        ltc_df['subsidy_available'] = True
        ltc_df['min_cost'] = clean_cost_column(ltc_df['Monthly Rate (Subsidized Basic)'])
        ltc_df['max_cost'] = clean_cost_column(ltc_df['Monthly Rate (Unsubsidized Private)'])
        ltc_df['pricing_info'] = "Subsidized rates available."
        if 'google_review' in ltc_df.columns:
            ltc_df['google_review'] = ltc_df['google_review'].apply(parse_rating)

        ret_df.rename(columns={'RH Home Name': 'name', 'Address': 'address', 'City': 'city', 'Postal Code': 'postal_code', 'Phone Number': 'phone', 'Website': 'website', 'Key Amenities': 'amenities', 'Google Rating': 'google_review', 'Reviews': 'number_of_reviews', 'Pricing (approx.)': 'pricing_info', 'Details': 'description'}, inplace=True)
        ret_df['type'] = 'Retirement'
        ret_df['subsidy_available'] = False
        ret_df['min_cost'] = ret_df['pricing_info'].apply(parse_cost_from_string)
        ret_df['max_cost'] = ret_df['min_cost'] + 1500
        if 'google_review' in ret_df.columns:
            ret_df['google_review'] = ret_df['google_review'].apply(parse_rating)

    except FileNotFoundError as e:
        print(f"\nFATAL ERROR: File not found. Please ensure '{e.filename}' is in the same directory as the script.")
        sys.exit(1)
    except KeyError as e:
        print(f"\nFATAL ERROR: A required column was not found: {e}.")
        sys.exit(1)

    combined_df = pd.concat([ltc_df, ret_df], ignore_index=True)
    combined_df.dropna(subset=['name'], inplace=True)
    combined_df = combined_df[combined_df['name'].str.strip() != '']
    combined_df['id'] = range(1, len(combined_df) + 1)

    print("\nStarting live data fetch from Google Places API (this may take several minutes)...")
    api_data = combined_df.apply(lambda row: get_google_place_details(gmaps, row['name'], row['address']), axis=1)
    print("API data fetch complete.")

    api_df = pd.json_normalize(api_data)

    combined_df['google_review'] = pd.Series(np.where(api_df['rating'] > 0, api_df['rating'], combined_df['google_review'])).fillna(0).round(1)
    combined_df['number_of_reviews'] = pd.Series(np.where(api_df['review_count'] > 0, api_df['review_count'], combined_df.get('number_of_reviews'))).fillna(0).astype(int)
    combined_df['city'] = api_df['city'].fillna(combined_df['city'])
    
    combined_df['image_url_1'] = api_df['photos'].apply(lambda x: x[0] if x and len(x) > 0 else PLACEHOLDER_IMAGE)
    combined_df['image_url_2'] = api_df['photos'].apply(lambda x: x[1] if x and len(x) > 1 else PLACEHOLDER_IMAGE)
    combined_df['image_url_3'] = api_df['photos'].apply(lambda x: x[2] if x and len(x) > 2 else PLACEHOLDER_IMAGE)
    combined_df['reviews'] = api_df['reviews']

    for col in ['name', 'city', 'address', 'postal_code', 'phone', 'website', 'amenities', 'pricing_info', 'description']:
        if col not in combined_df.columns:
            combined_df[col] = ''
        combined_df[col] = combined_df[col].astype(str).str.strip().replace('nan', '')
    
    combined_df['description'] = combined_df['description'].fillna("A trusted provider of senior care in its community, offering a range of services to meet the needs of its residents.")

    final_columns = [
        'id', 'name', 'type', 'address', 'city', 'postal_code', 'phone', 'website',
        'subsidy_available', 'min_cost', 'max_cost', 'pricing_info', 'google_review', 'number_of_reviews',
        'amenities', 'reviews', 'description', 'image_url_1', 'image_url_2', 'image_url_3'
    ]
    
    final_df = combined_df[[col for col in final_columns if col in combined_df.columns]].copy()
    final_df.replace({np.nan: None}, inplace=True)
    
    final_df.to_csv(OUTPUT_CSV_FILE, index=False)
    print(f"\nSuccessfully created the reference CSV file: {OUTPUT_CSV_FILE}")
    json_data = final_df.to_dict(orient='records')
    with open(OUTPUT_JS_FILE, 'w') as f:
        f.write("export const homesData = ")
        json.dump(json_data, f, indent=4)
        f.write(";")
    print(f"Successfully created the JavaScript data file: {OUTPUT_JS_FILE}")
    print("\n--- Script Finished ---")
