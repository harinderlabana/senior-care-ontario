import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactGA from "react-ga4";
import {
  BackArrowIcon,
  CheckmarkIcon,
  DirectionsIcon,
  MapPinIcon,
} from "../common/Icons";
import Meta from "../common/Meta";
import JsonLdSchema from "../common/JsonLdSchema";
import GoogleReview from "../common/GoogleReview";
import AdSense from "../common/AdSense";

const DetailsPage = ({ allHomes }) => {
  const { homeId } = useParams();
  const home = allHomes.find((h) => h.id === parseInt(homeId));

  // FIX: Moved useState calls to the top level of the component
  const [mainImage, setMainImage] = useState(home ? home.image_url_1 : null);

  if (!home) {
    return (
      <div className="container mx-auto p-8 text-center">Home not found.</div>
    );
  }

  const galleryImages = [
    home.image_url_1,
    home.image_url_2,
    home.image_url_3,
  ].filter(Boolean);

  const trackClick = (action) => {
    ReactGA.event({
      category: "User Interaction",
      action: action,
      label: `${home.name} - ${home.city}`,
    });
  };

  const fullAddress = `${home.address}, ${home.city}, ${home.postal_code}`;

  return (
    <div className="animate-fade-in">
      <Meta
        title={`${home.name} | SeniorCare Ontario`}
        description={`Learn more about ${home.name}, a ${home.type} home in ${home.city}, Ontario. View amenities, photos, and contact information.`}
      />
      <JsonLdSchema home={home} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="inline-flex items-center mb-8 px-4 py-2 border border-gray-300 text-base font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition-colors"
        >
          <BackArrowIcon className="h-5 w-5 mr-2 text-gray-600" />
          Back to Directory
        </Link>
        <article className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative">
            <img
              src={mainImage}
              alt={`Main view of ${home.name}`}
              className="w-full h-[35vh] md:h-[60vh] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <p className="font-semibold text-white/90 uppercase tracking-widest text-sm">
                {home.type}
              </p>
              <h1 className="font-heading text-4xl lg:text-6xl font-black text-white mt-1 drop-shadow-lg">
                {home.name}
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200">
            <div className="bg-white p-4 text-center">
              <p className="text-sm text-gray-500">Care Type</p>
              <p className="font-bold text-lg text-[#0c2d48]">{home.type}</p>
            </div>
            <div className="bg-white p-4 text-center">
              <p className="text-sm text-gray-500">Starting Cost</p>
              <p className="font-bold text-lg text-[#0c2d48]">
                {home.min_cost
                  ? `$${home.min_cost.toLocaleString()}/mo`
                  : home.pricing_info}
              </p>
            </div>
            <div className="bg-white p-4 text-center">
              <p className="text-sm text-gray-500">Google Rating</p>
              <div className="flex justify-center items-center">
                <GoogleReview rating={home.google_review} />
              </div>
            </div>
            <div className="bg-white p-4 text-center">
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-bold text-lg text-[#0c2d48]">
                {home.city || home.postal_code}
              </p>
            </div>
          </div>
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2 p-8 lg:p-12 space-y-12">
              <section>
                <h2 className="font-heading text-3xl font-bold text-[#0c2d48] mb-4">
                  About This Residence
                </h2>
                <p className="text-lg text-gray-600 flex items-center mb-4">
                  <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                  {fullAddress}
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {home.description}
                </p>
              </section>
              <section>
                <h3 className="font-heading text-3xl font-bold text-[#0c2d48] mb-6">
                  Photo Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {galleryImages.map((img, index) => (
                    <button
                      key={img}
                      onClick={() => setMainImage(img)}
                      className="rounded-lg overflow-hidden aspect-w-16 aspect-h-9"
                      aria-label={`View image ${index + 1} of ${home.name}`}
                    >
                      <img
                        loading="lazy"
                        src={img}
                        alt={`A view of the ${home.name} residence`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="font-heading text-3xl font-bold text-[#0c2d48] mb-6">
                  Featured Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-lg">
                  {home.amenities &&
                    (typeof home.amenities === "string"
                      ? home.amenities.split(", ")
                      : home.amenities
                    ).map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <CheckmarkIcon className="h-6 w-6 mr-3 text-white bg-[#0c2d48] rounded-full p-1 flex-shrink-0" />
                        <span className="text-gray-800">{amenity}</span>
                      </div>
                    ))}
                </div>
              </section>
              <section>
                <h3 className="font-heading text-3xl font-bold text-[#0c2d48] mb-6">
                  Recent Reviews
                </h3>
                <div className="space-y-8">
                  {home.reviews && home.reviews.length > 0 ? (
                    home.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-gray-200 pl-4"
                      >
                        <div className="flex items-center mb-1">
                          <GoogleReview
                            rating={review.rating}
                            showText={false}
                          />
                          <p className="ml-3 font-bold text-gray-800">
                            {review.user}
                          </p>
                        </div>
                        <p className="text-gray-700 italic">
                          "{review.snippet}"
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                          {review.date}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">
                      No recent reviews available.
                    </p>
                  )}
                </div>
              </section>
            </div>
            <aside className="p-8 lg:p-0 lg:pr-12 lg:pb-12">
              <div className="sticky top-28 space-y-6">
                <div className="p-6 bg-white rounded-xl border-2 border-gray-200 text-center">
                  <h3 className="font-heading text-2xl font-bold text-[#0c2d48] mb-4">
                    Interested?
                  </h3>
                  <div className="flex flex-col space-y-3">
                    <a
                      href={`tel:${home.phone}`}
                      onClick={() => trackClick("click_call")}
                      className="w-full text-center bg-[#D4AF37] text-[#0c2d48] font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity text-lg"
                    >
                      Call to Inquire
                    </a>
                    <a
                      href={home.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackClick("click_website")}
                      className="w-full text-center bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors text-lg"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
                <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
                  <h3 className="font-heading text-xl font-bold text-[#0c2d48] mb-4">
                    Location
                  </h3>
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=$${encodeURIComponent(
                        fullAddress
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackClick("click_directions_map")}
                    >
                      <img
                        className="w-full h-full object-cover"
                        src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
                          fullAddress
                        )}&zoom=14&size=600x400&markers=color:0x0c2d48%7C${encodeURIComponent(
                          fullAddress
                        )}&key=YOUR_API_KEY`}
                        alt={`Map showing location of ${home.name}`}
                      />
                    </a>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=$${encodeURIComponent(
                      fullAddress
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick("click_directions_button")}
                    className="mt-4 w-full flex items-center justify-center text-center bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors text-lg"
                  >
                    <DirectionsIcon className="h-5 w-5 mr-2" />
                    Get Directions
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </article>
      </div>
    </div>
  );
};

export default DetailsPage;
