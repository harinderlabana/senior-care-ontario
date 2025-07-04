// In src/components/pages/ShortlistPage.js
import React from "react";
import { Link } from "react-router-dom";
import HomeCard from "../home/HomeCard";
import Meta from "../common/Meta";

const ShortlistPage = ({ allHomes, favorites, onToggleFavorite }) => {
  const favoritedHomes = allHomes.filter((home) => favorites.includes(home.id));

  return (
    <main className="animate-fade-in">
      <Meta
        title="My Shortlist | SeniorCare Ontario"
        description="View your saved list of potential retirement and long-term care homes."
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/" className="text-[#145DA0] hover:underline">
            &larr; Back to Main Directory
          </Link>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#0c2d48] mb-4">
          My Shortlist
        </h1>

        {favoritedHomes.length > 0 ? (
          <>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl">
              Here are the residences you've saved. You can easily compare your
              top choices and continue your research.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoritedHomes.map((home) => (
                <HomeCard
                  key={home.id}
                  home={home}
                  isFavorite={true} // It's always favorited on this page
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <h3 className="font-heading text-3xl font-semibold text-gray-800">
              Your Shortlist is Empty
            </h3>
            <p className="text-gray-500 mt-2 text-lg">
              Click the heart icon on any listing to save it here for later.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ShortlistPage;
