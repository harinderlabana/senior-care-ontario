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
  // State for the filters that are actively filtering the list
  const [activeFilters, setActiveFilters] = useState({
    city: "all",
    type: "all",
    minCost: "",
    maxCost: "",
  });
  const [activeSearchTerm, setActiveSearchTerm] = useState("");

  // State for the user's selections in the UI before they click "Apply"
  const [pendingFilters, setPendingFilters] = useState({
    city: "all",
    type: "all",
    minCost: "",
    maxCost: "",
  });
  const [pendingSearchTerm, setPendingSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState("list");
  const [selectedHomeId, setSelectedHomeId] = useState(null);

  // FIX: Initialize favorites from localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem("seniorCareFavorites");
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
      console.error("Could not parse favorites from localStorage", error);
      return [];
    }
  });

  const [showFavorites, setShowFavorites] = useState(false);
  const [costError, setCostError] = useState("");
  const [listPage, setListPage] = useState(1);

  // FIX: Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("seniorCareFavorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Could not save favorites to localStorage", error);
    }
  }, [favorites]);

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
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...pendingFilters, [name]: value };
    setPendingFilters(newFilters);

    const min = Number(newFilters.minCost);
    const max = Number(newFilters.maxCost);
    if (min && max && max < min) {
      setCostError("Maximum cost cannot be less than the minimum cost.");
    } else {
      setCostError("");
    }
  };

  const handleApplyFilters = () => {
    if (costError) return;
    setListPage(1);
    setActiveFilters(pendingFilters);
    setActiveSearchTerm(pendingSearchTerm);
  };

  const handleResetFilters = () => {
    const initialFilters = {
      city: "all",
      type: "all",
      minCost: "",
      maxCost: "",
    };
    setPendingFilters(initialFilters);
    // Only reset active filters if not currently viewing shortlist
    if (!showFavorites) {
      setActiveFilters(initialFilters);
      setActiveSearchTerm("");
    }
    setCostError("");
    setListPage(1);
  };

  const handleShowFavoritesClick = () => {
    const newShowFavorites = !showFavorites;
    setShowFavorites(newShowFavorites);
    setListPage(1);

    // When showing favorites, clear any pending/active filters
    if (newShowFavorites) {
      const initialFilters = {
        city: "all",
        type: "all",
        minCost: "",
        maxCost: "",
      };
      setPendingFilters(initialFilters);
      setActiveFilters(initialFilters);
      setPendingSearchTerm("");
      setActiveSearchTerm("");
      setCostError("");
    }
  };

  const filteredHomes = useMemo(() => {
    if (costError && !showFavorites) return [];
    if (!Array.isArray(homesData)) return [];

    let result = showFavorites
      ? homesData.filter((h) => h && favorites.includes(h.id))
      : homesData.filter(Boolean);

    if (activeSearchTerm) {
      const lowercasedSearchTerm = activeSearchTerm.toLowerCase();
      result = result.filter(
        (h) =>
          (h.name && h.name.toLowerCase().includes(lowercasedSearchTerm)) ||
          (h.city && h.city.toLowerCase().includes(lowercasedSearchTerm))
      );
    }
    if (activeFilters.city !== "all") {
      result = result.filter((h) => h.city === activeFilters.city);
    }
    if (activeFilters.type !== "all") {
      result = result.filter((h) => h.type === activeFilters.type);
    }
    if (activeFilters.minCost) {
      result = result.filter(
        (h) =>
          h.min_cost === null ||
          (h.max_cost && h.max_cost >= Number(activeFilters.minCost))
      );
    }
    if (activeFilters.maxCost) {
      result = result.filter(
        (h) =>
          h.min_cost === null ||
          (h.min_cost && h.min_cost <= Number(activeFilters.maxCost))
      );
    }
    return result;
  }, [activeSearchTerm, activeFilters, favorites, showFavorites, costError]);

  const handleViewDetails = (id) => {
    setSelectedHomeId(id);
    setCurrentPage("details");
    window.scrollTo(0, 0);
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

  const selectedHome = homesData.find(
    (home) => home && home.id === selectedHomeId
  );
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
    <div className="bg-[#F1E9DA] min-h-screen font-sans text-gray-800 w-full max-w-full overflow-x-hidden">
      <style>{/* ... */}</style>
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
          filters={pendingFilters}
          searchTerm={pendingSearchTerm}
          onFilterChange={handleFilterChange}
          onSearchChange={(e) => setPendingSearchTerm(e.target.value)}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          onViewDetails={handleViewDetails}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          isShowingFavorites={showFavorites}
          costError={costError}
          currentPage={listPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          setPendingSearchTerm={setPendingSearchTerm}
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
