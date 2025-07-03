import os
from dotenv import load_dotenv
import pandas as pd
import re
import numpy as np
import json
import requests
from bs4 import BeautifulSoup
import time
import sys
# Make sure to install the Google Maps library: pip3 install googlemaps
try:
    import googlemaps
except ImportError:
    print("FATAL ERROR: The 'googlemaps' library is not installed.")
    print("Please install it by running: pip3 install googlemaps")
    sys.exit(1)

# --- Configuration ---
# Load environment variables from .env file
load_dotenv()
GOOGLE_API_KEY = os.getenv("REACT_APP_GOOGLE_MAPS_API_KEY")
# This is the same key you use for the Places API.
# You will also need to enable the "Generative Language API" in your Google Cloud project.
GEMINI_API_KEY = GOOGLE_API_KEY 

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

def scrape_website_for_text(url):
    """
    Scrapes the main textual content from a given URL by looking for common content containers.
    """
    if not pd.notna(url) or 'http' not in str(url):
        return None
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            content_tags = ['main', 'article', 'div[id*="main"]', 'div[id*="content"]', 'div[class*="main"]', 'div[class*="content"]']
            text_content = ''
            for tag in content_tags:
                content_area = soup.select_one(tag)
                if content_area:
                    text_content = content_area.get_text(separator=' ', strip=True)
                    break 
            
            # FIX: Check if soup.body exists before trying to get text from it.
            if not text_content and soup.body:
                text_content = soup.body.get_text(separator=' ', strip=True)

            cleaned_text = re.sub(r'\s+', ' ', text_content)
            return cleaned_text[:2500]
    except requests.RequestException as e:
        print(f"      -> Scraping failed for {url}: {e}")
    return None

def enhance_description_with_ai(text, home_name):
    """Uses a generative model to rewrite the description."""
    if not text:
        print(f"      -> No text scraped for {home_name}. Using default description.")
        return f"A trusted provider of senior care in its community, offering a range of services to meet the needs of its residents."

    print(f"      -> Enhancing description for {home_name} with AI...")
    
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    
    prompt = f"""
    Based on the following raw text from a senior care home's website, please write a warm, professional, and welcoming "About This Residence" description of about 80-120 words for a directory website. 
    Focus on the community's philosophy, atmosphere, and the lifestyle it offers. Ignore navigation links, copyright notices, and other non-descriptive text.
    
    RAW TEXT:
    ---
    {text}
    ---
    
    REWRITTEN DESCRIPTION:
    """
    
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(api_url, headers=headers, json=payload, timeout=20)
        if response.status_code == 200:
            result = response.json()
            enhanced_text = result['candidates'][0]['content']['parts'][0]['text']
            return enhanced_text.strip()
        else:
            print(f"      -> AI enhancement failed with status {response.status_code}: {response.text}")
            return text
    except requests.RequestException as e:
        print(f"      -> AI API call failed: {e}")
        return text

def get_google_place_details(gmaps_client, home_name, address):
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
    if GOOGLE_API_KEY == "YOUR_GOOGLE_MAPS_API_KEY_HERE":
        print("FATAL ERROR: You have not added your Google Maps API Key to the script.")
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

    print("\nStarting live data fetch & enhancement (this may take several minutes)...")
    api_data = combined_df.apply(lambda row: get_google_place_details(gmaps, row['name'], row['address']), axis=1)
    
    print("\nScraping websites for descriptions...")
    scraped_texts = combined_df.apply(lambda row: scrape_website_for_text(row.get('website')), axis=1)
    print("Enhancing descriptions with AI...")
    enhanced_descriptions = [enhance_description_with_ai(text, name) for text, name in zip(scraped_texts, combined_df['name'])]
    
    api_df = pd.json_normalize(api_data)

    combined_df['google_review'] = pd.Series(np.where(api_df['rating'] > 0, api_df['rating'], combined_df['google_review'])).fillna(0).round(1)
    combined_df['number_of_reviews'] = pd.Series(np.where(api_df['review_count'] > 0, api_df['review_count'], combined_df.get('number_of_reviews'))).fillna(0).astype(int)
    combined_df['city'] = api_df['city'].fillna(combined_df['city'])
    combined_df['description'] = enhanced_descriptions
    
    combined_df['image_url_1'] = api_df['photos'].apply(lambda x: x[0] if x and len(x) > 0 else PLACEHOLDER_IMAGE)
    combined_df['image_url_2'] = api_df['photos'].apply(lambda x: x[1] if x and len(x) > 1 else PLACEHOLDER_IMAGE)
    combined_df['image_url_3'] = api_df['photos'].apply(lambda x: x[2] if x and len(x) > 2 else PLACEHOLDER_IMAGE)
    combined_df['reviews'] = api_df['reviews']

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
