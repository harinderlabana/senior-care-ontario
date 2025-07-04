import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactGA from "react-ga4";
import { homesData } from "./data/homesData";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./components/home/HomePage";
import DetailsPage from "./components/details/DetailsPage";
import CityPage from "./components/pages/CityPage";
import ShortlistPage from "./components/pages/ShortlistPage"; // Import the new page

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
        <style>{`
                  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Mulish:wght@400;600;700&display=swap');
                  body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
                  .font-heading { font-family: 'Playfair Display', serif; }
                  .font-sans { font-family: 'Mulish', sans-serif; }
                  .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
                  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
              `}</style>
        <Header favoritesCount={favorites.length} />
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
          {/* Add the new route for the shortlist page */}
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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
