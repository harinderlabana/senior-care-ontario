import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BuildingIcon, MenuIcon, CloseIcon } from "../common/Icons";

const Header = ({ favoritesCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white/95 shadow-sm sticky top-0 z-30 backdrop-blur-lg border-b border-gray-200">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              to="/"
              className="flex items-center gap-3"
              aria-label="Return to homepage"
            >
              <div className="w-10 h-10 bg-[#0c2d48] text-white flex items-center justify-center rounded-lg">
                <BuildingIcon className="w-6 h-6" />
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-black text-[#0c2d48]">
                SeniorCare Ontario
              </h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/blog"
                className="px-4 py-2 rounded-lg font-semibold text-[#0c2d48] hover:bg-gray-100 transition-colors"
              >
                Resource Center
              </Link>
              <Link
                to="/shortlist"
                className="relative px-4 py-2 rounded-lg font-semibold bg-[#0c2d48] text-white transition-colors"
              >
                My Shortlist
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <MenuIcon className="w-8 h-8 text-[#0c2d48]" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* FIX: Mobile Menu now a slide-in overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsMenuOpen(false)}
        ></div>

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col p-6 space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <CloseIcon className="w-8 h-8 text-gray-500" />
              </button>
            </div>
            <Link
              to="/blog"
              onClick={() => setIsMenuOpen(false)}
              className="text-xl font-semibold text-gray-700 hover:text-[#145DA0]"
            >
              Resource Center
            </Link>
            <Link
              to="/shortlist"
              onClick={() => setIsMenuOpen(false)}
              className="relative flex items-center gap-3 text-xl font-semibold text-gray-700 hover:text-[#145DA0]"
            >
              <span>My Shortlist</span>
              {favoritesCount > 0 && (
                <span className="bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
