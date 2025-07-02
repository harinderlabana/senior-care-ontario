import React from "react";

const JsonLdSchema = ({ home }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: home.name,
    description: home.description,
    image: [home.image_url_1, home.image_url_2, home.image_url_3].filter(
      Boolean
    ),
    address: {
      "@type": "PostalAddress",
      streetAddress: home.address.split(",")[0],
      addressLocality: home.city,
      addressRegion: "ON",
      country: "CA",
    },
    telephone: home.phone,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: home.googleReview,
      reviewCount: home.reviewCount,
    },
    priceRange: `$${home.minCost} - $${home.maxCost}`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default JsonLdSchema;
