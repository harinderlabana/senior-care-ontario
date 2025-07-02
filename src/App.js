import React, { useState, useEffect, useMemo } from "react";
import ReactGA from "react-ga4";
import { homesData } from "./data/homesData"; // Import real data
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./components/home/HomePage";
import DetailsPage from "./components/details/DetailsPage";

const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;
const ITEMS_PER_PAGE = 15; // Set how many homes to show per page

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    city: "all",
    type: "all",
    minCost: "",
    maxCost: "",
  });
  const [currentPage, setCurrentPage] = useState("list");
  const [selectedHomeId, setSelectedHomeId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [costError, setCostError] = useState("");
  const [listPage, setListPage] = useState(1);

  useEffect(() => {
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
      ReactGA.initialize(GA_MEASUREMENT_ID);
    }
  }, []);

  const toggleFavorite = (id) => {
    const isCurrentlyFavorite = favorites.includes(id);
    setFavorites((prev) =>
      isCurrentlyFavorite ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
    ReactGA.event({
      category: "Engagement",
      action: isCurrentlyFavorite
        ? "remove_from_shortlist"
        : "add_to_shortlist",
      label: `Home ID: ${id}`,
    });
  };

  const handleFilterChange = (e) => {
    setListPage(1);
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const min = Number(newFilters.minCost);
    const max = Number(newFilters.maxCost);
    if (min && max && max < min) {
      setCostError("Maximum cost cannot be less than the minimum cost.");
    } else {
      setCostError("");
    }
    ReactGA.event({
      category: "Filter",
      action: `apply_filter_${name}`,
      label: value,
    });
  };

  const handleSearch = (e) => {
    setListPage(1);
    setSearchTerm(e.target.value);
    ReactGA.event({
      category: "Search",
      action: "enter_search_term",
      label: e.target.value,
    });
  };

  const handleResetFilters = () => {
    setFilters({ city: "all", type: "all", minCost: "", maxCost: "" });
    setSearchTerm("");
    // FIX: Do NOT change showFavorites state on reset
    // setShowFavorites(false);
    setCostError("");
    setListPage(1);
    ReactGA.event({ category: "Filter", action: "reset_filters" });
  };

  const handleShowFavoritesClick = () => {
    const newShowFavorites = !showFavorites;
    setShowFavorites(newShowFavorites);
    setListPage(1);

    if (newShowFavorites) {
      setFilters({ city: "all", type: "all", minCost: "", maxCost: "" });
      setSearchTerm("");
      setCostError("");
    }
  };

  const filteredHomes = useMemo(() => {
    if (costError) return [];
    if (!Array.isArray(homesData)) return [];

    let result = showFavorites
      ? homesData.filter((h) => favorites.includes(h.id))
      : homesData;

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (h) =>
          (h.name && h.name.toLowerCase().includes(lowercasedSearchTerm)) ||
          (h.city && h.city.toLowerCase().includes(lowercasedSearchTerm))
      );
    }
    if (filters.city !== "all") {
      result = result.filter((h) => h.city === filters.city);
    }
    if (filters.type !== "all") {
      result = result.filter((h) => h.type === filters.type);
    }
    if (filters.minCost) {
      result = result.filter(
        (h) => h.max_cost && h.max_cost >= Number(filters.minCost)
      );
    }
    if (filters.maxCost) {
      result = result.filter(
        (h) => h.min_cost && h.min_cost <= Number(filters.maxCost)
      );
    }
    return result;
  }, [searchTerm, filters, favorites, showFavorites, costError]);

  const handleViewDetails = (id) => {
    setSelectedHomeId(id);
    setCurrentPage("details");
    window.scrollTo(0, 0);
    const home = homesData.find((h) => h.id === id);
    ReactGA.event({
      category: "Navigation",
      action: "view_residence_details",
      label: `${home.name} - ${home.city}`,
    });
  };

  const handleBackToList = () => {
    setSelectedHomeId(null);
    setCurrentPage("list");
    setShowFavorites(false);
  };

  const handlePageChange = (pageNumber) => {
    setListPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const selectedHome = homesData.find((home) => home.id === selectedHomeId);

  const totalPages = Math.ceil(filteredHomes.length / ITEMS_PER_PAGE);
  const paginatedHomes = filteredHomes.slice(
    (listPage - 1) * ITEMS_PER_PAGE,
    listPage * ITEMS_PER_PAGE
  );

  if (!homesData || !Array.isArray(homesData)) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F1E9DA] text-2xl font-heading">
        Loading Data...
      </div>
    );
  }

  return (
    <div className="bg-[#F1E9DA] min-h-screen font-sans text-gray-800">
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Mulish:wght@400;600;700&display=swap');
                body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
                .font-heading { font-family: 'Playfair Display', serif; }
                .font-sans { font-family: 'Mulish', sans-serif; }
                .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
      <Header
        onBackToList={handleBackToList}
        onShowFavorites={handleShowFavoritesClick}
        favoritesCount={favorites.length}
        isShowingFavorites={showFavorites}
      />

      {currentPage === "list" && (
        <HomePage
          allHomes={homesData}
          filteredHomes={paginatedHomes}
          totalFilteredHomes={filteredHomes.length}
          filters={filters}
          searchTerm={searchTerm}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearch}
          onResetFilters={handleResetFilters}
          onViewDetails={handleViewDetails}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          isShowingFavorites={showFavorites}
          costError={costError}
          currentPage={listPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {currentPage === "details" && selectedHome && (
        <DetailsPage home={selectedHome} onBack={handleBackToList} />
      )}

      <Footer />
    </div>
  );
};

export default App;
