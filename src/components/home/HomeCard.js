import React from "react";
import { MapPinIcon, CheckmarkIcon, HeartIcon } from "../common/Icons";
import GoogleReview from "../common/GoogleReview";

const HomeCard = React.memo(
  ({ home, onViewDetails, isFavorite, onToggleFavorite }) => (
    <article
      className="bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 border border-gray-200 group flex flex-col"
      aria-label={`View details for ${home.name}`}
    >
      <div className="relative">
        <img
          loading="lazy"
          src={home.image_url_1}
          alt={`Exterior of ${home.name}`}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
          onClick={() => onViewDetails(home.id)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(home.id);
          }}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 text-gray-700 hover:text-red-500 hover:bg-white transition-colors"
          aria-label="Add to favorites"
        >
          <HeartIcon
            className={`w-6 h-6 ${
              isFavorite ? "text-red-500" : "text-gray-600"
            }`}
            filled={isFavorite}
          />
        </button>
        <div className="absolute bottom-0 left-0 p-6 pointer-events-none">
          <div className="bg-white/90 px-3 py-1.5 rounded-full text-sm font-semibold text-[#0c2d48] backdrop-blur-sm shadow-sm mb-2 w-fit">
            {home.type}
          </div>
          <h3 className="font-heading text-2xl font-bold text-white drop-shadow-md">
            {home.name}
          </h3>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        {/* FIX: Display the full address */}
        <p className="text-gray-500 flex items-center text-md mb-4">
          <MapPinIcon className="h-5 w-5 mr-1.5 text-gray-400" />
          {home.address}
        </p>
        <div className="space-y-2">
          {home.amenities &&
            (typeof home.amenities === "string"
              ? home.amenities.split(", ")
              : home.amenities
            )
              .slice(0, 2)
              .map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center text-sm text-gray-600"
                >
                  <CheckmarkIcon className="w-4 h-4 mr-2 text-white bg-[#0c2d48]/80 rounded-full p-0.5" />
                  <span>{amenity}</span>
                </div>
              ))}
        </div>
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
          {/* FIX: Always render GoogleReview and let it handle logic */}
          <GoogleReview rating={home.google_review} />
          {/* FIX: Display pricing_info text when minCost is null */}
          <p className="font-sans text-xl font-bold text-[#0c2d48] ml-auto">
            {home.min_cost
              ? `$${home.min_cost.toLocaleString()}+`
              : home.pricing_info}
          </p>
        </div>
      </div>
      <div className="px-6 pb-6 mt-auto">
        <button
          onClick={() => onViewDetails(home.id)}
          className="w-full text-center bg-[#0c2d48] border-2 border-[#0c2d48] text-white font-bold py-3 px-4 rounded-lg group-hover:bg-[#145DA0] transition-all"
        >
          View Residence
        </button>
      </div>
    </article>
  )
);

export default HomeCard;
