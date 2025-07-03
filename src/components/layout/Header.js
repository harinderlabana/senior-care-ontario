import React from "react";
import { BuildingIcon } from "../common/Icons";

const Header = ({
  onBackToList,
  onShowFavorites,
  favoritesCount,
  isShowingFavorites,
}) => (
  // FIX: Re-added sticky positioning classes
  <header className="bg-white/95 shadow-sm sticky top-0 z-20 backdrop-blur-lg border-b border-gray-200">
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <button
        onClick={(e) => {
          e.preventDefault();
          onBackToList();
        }}
        className="flex items-center gap-3"
        aria-label="Return to homepage"
      >
        <div className="w-10 h-10 bg-[#0c2d48] text-white flex items-center justify-center rounded-lg">
          <BuildingIcon className="w-6 h-6" />
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-black text-[#0c2d48]">
          SeniorCare Ontario
        </h1>
      </button>
      <button
        onClick={onShowFavorites}
        className="relative px-4 py-2 rounded-lg font-semibold transition-colors"
        style={{
          backgroundColor: isShowingFavorites ? "#D4AF37" : "#0c2d48",
          color: isShowingFavorites ? "#0c2d48" : "white",
        }}
      >
        {isShowingFavorites ? "Showing Shortlist" : "My Shortlist"}
        {favoritesCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {favoritesCount}
          </span>
        )}
      </button>
    </nav>
  </header>
);

export default Header;
