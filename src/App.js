import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReactGA from "react-ga4";
import { homesData } from "./data/homesData";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./components/home/HomePage";
import DetailsPage from "./components/details/DetailsPage";
import CityPage from "./components/pages/CityPage";
import ShortlistPage from "./components/pages/ShortlistPage";
import BlogPage from "./components/pages/BlogPage";
import BlogPost from "./components/pages/BlogPost";
import { CloseIcon } from "./components/common/Icons";

const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

const App = () => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem("seniorCareFavorites");
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
      return [];
    }
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
      ReactGA.initialize(GA_MEASUREMENT_ID);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("seniorCareFavorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Could not save favorites to localStorage", error);
    }
  }, [favorites]);

  const toggleFavorite = (id) => {
    const isCurrentlyFavorite = favorites.includes(id);
    setFavorites((prev) =>
      isCurrentlyFavorite ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <Router>
      <div className="bg-[#F1E9DA] min-h-screen font-sans text-gray-800">
        <style>{/* ... */}</style>
        <Header
          favoritesCount={favorites.length}
          isMenuOpen={isMenuOpen}
          onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                allHomes={homesData}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="/home/:homeId"
            element={<DetailsPage allHomes={homesData} />}
          />
          <Route
            path="/city/:cityName"
            element={
              <CityPage
                allHomes={homesData}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="/shortlist"
            element={
              <ShortlistPage
                allHomes={homesData}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            }
          />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
        <Footer />

        {/* FIX: Mobile Menu Overlay is now rendered here, outside the header */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-[#0c2d48] z-40 flex flex-col items-center justify-center space-y-8">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-4"
              aria-label="Close menu"
            >
              <CloseIcon className="w-8 h-8 text-white" />
            </button>
            <Link
              to="/blog"
              onClick={() => setIsMenuOpen(false)}
              className="text-3xl font-bold text-white hover:text-[#D4AF37] transition-colors"
            >
              Resource Center
            </Link>
            <Link
              to="/shortlist"
              onClick={() => setIsMenuOpen(false)}
              className="relative text-3xl font-bold text-white hover:text-[#D4AF37] transition-colors"
            >
              <span>My Shortlist</span>
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-7 bg-red-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
