import React from "react";
import { StarIcon } from "./Icons";

const GoogleReview = React.memo(({ rating, showText = true }) => {
  // FIX: Check if rating is a valid number and greater than 0.
  const isValidRating =
    typeof rating === "number" && !isNaN(rating) && rating > 0;

  return (
    <div className="flex items-center">
      {showText && (
        <span className="text-[#333] font-medium mr-2">
          {isValidRating ? rating.toFixed(1) : "No Rating"}
        </span>
      )}
      <div className="flex text-[#D4AF37]">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`w-5 h-5 ${
              isValidRating && i + 0.5 < rating
                ? "text-[#D4AF37]"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
});

export default GoogleReview;
