import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HomeCard from "./HomeCard";
import {
  SearchIcon,
  CheckmarkIcon,
  HeartIcon,
  BuildingIcon,
} from "../common/Icons";
import Meta from "../common/Meta";
import Pagination from "../common/Pagination";
import AdSense from "../common/AdSense";

const HomePage = ({ allHomes, favorites, onToggleFavorite }) => {
  const [activeFilters, setActiveFilters] = useState({
    city: "all",
    type: "all",
    minCost: "",
    maxCost: "",
  });
  const [pendingFilters, setPendingFilters] = useState({
    city: "all",
    type: "all",
    minCost: "",
    maxCost: "",
  });
  const [pendingSearchTerm, setPendingSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [costError, setCostError] = useState("");
  const [listPage, setListPage] = useState(1);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const allCities = useMemo(
    () =>
      [...new Set(allHomes.map((item) => item.city).filter(Boolean))].sort(),
    [allHomes]
  );

  const topCities = useMemo(() => {
    const cityCounts = allHomes.reduce((acc, home) => {
      if (home.city) acc[home.city] = (acc[home.city] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map((entry) => entry[0]);
  }, [allHomes]);

  useEffect(() => {
    if (pendingSearchTerm) {
      const suggestions = allCities.filter((city) =>
        city.toLowerCase().startsWith(pendingSearchTerm.toLowerCase())
      );
      setCitySuggestions(suggestions);
    } else {
      setCitySuggestions([]);
    }
  }, [pendingSearchTerm, allCities]);

  const handleSuggestionClick = (city) => {
    setPendingSearchTerm(city);
    setShowSuggestions(false);
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

  const onResetFilters = () => {
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
    setListPage(1);
  };

  const filteredHomes = useMemo(() => {
    if (costError) return [];
    let result = allHomes.filter(Boolean);

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
  }, [activeSearchTerm, activeFilters, allHomes, costError]);

  const totalFilteredHomes = filteredHomes.length;
  const totalPages = Math.ceil(totalFilteredHomes / 15);
  const paginatedHomes = filteredHomes.slice(
    (listPage - 1) * 15,
    listPage * 15
  );

  const handlePageChange = (pageNumber) => {
    setListPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const priceOptions = useMemo(() => {
    const options = [];
    for (let i = 2000; i <= 10000; i += 500) {
      options.push(i);
    }
    return options;
  }, []);

  const homesWithAds = useMemo(() => {
    const homesWithAds = [];
    for (let i = 0; i < paginatedHomes.length; i++) {
      homesWithAds.push(paginatedHomes[i]);
      if (i + 1 === 6) {
        homesWithAds.push({ isAd: true, id: `ad-${i}` });
      }
    }
    return homesWithAds;
  }, [paginatedHomes]);

  return (
    <main>
      <Meta
        title="SeniorCare Ontario | Your Trusted Guide to Senior Care"
        description="Find the perfect retirement home or long-term care facility in Ontario. SeniorCare Ontario offers a trusted, comprehensive directory to help you find care with confidence."
      />
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="font-heading text-4xl md:text-6xl font-black text-[#0c2d48]">
                The Right Care, The Right Home.
              </h2>
              <p className="mt-4 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 text-gray-600">
                Finding the right care for a loved one is one of the most
                important decisions you'll make. Our comprehensive directory and
                powerful search tools are here to provide clarity and confidence
                on your journey.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="sm:col-span-2 relative">
                  <label
                    htmlFor="search"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Search by Name or City
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pt-6">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="search"
                    type="text"
                    value={pendingSearchTerm}
                    onChange={(e) => setPendingSearchTerm(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 150)
                    }
                    placeholder="e.g., Maplewood or Toronto"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#145DA0] focus:border-[#145DA0] text-lg"
                  />
                  {citySuggestions.length > 0 && showSuggestions && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
                      {citySuggestions.map((city) => (
                        <li
                          key={city}
                          onMouseDown={() => handleSuggestionClick(city)}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="cityFilter"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <select
                    id="cityFilter"
                    name="city"
                    value={pendingFilters.city}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#145DA0] focus:border-[#145DA0] text-base"
                  >
                    <option value="all">All Cities</option>
                    {allCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="typeFilter"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Home Type
                  </label>
                  <select
                    id="typeFilter"
                    name="type"
                    value={pendingFilters.type}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#145DA0] focus:border-[#145DA0] text-base"
                  >
                    <option value="all">All Types</option>
                    <option value="Retirement">Retirement</option>
                    <option value="Long Term Care">Long Term Care</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="minCost"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Min. Cost
                  </label>
                  <select
                    id="minCost"
                    name="minCost"
                    value={pendingFilters.minCost}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#145DA0] focus:border-[#145DA0] text-base"
                  >
                    <option value="">Any</option>
                    {priceOptions.map((price) => (
                      <option key={price} value={price}>
                        ${price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="maxCost"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Max. Cost
                  </label>
                  <select
                    id="maxCost"
                    name="maxCost"
                    value={pendingFilters.maxCost}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#145DA0] focus:border-[#145DA0] text-base"
                  >
                    <option value="">Any</option>
                    {priceOptions.map((price) => (
                      <option key={price} value={price}>
                        ${price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2 grid grid-cols-2 gap-4">
                  <button
                    onClick={handleApplyFilters}
                    className="w-full bg-[#0c2d48] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#145DA0] transition-colors h-[50px]"
                  >
                    Apply
                  </button>
                  <button
                    onClick={onResetFilters}
                    className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors h-[50px]"
                  >
                    Reset
                  </button>
                </div>
              </div>
              {costError && (
                <div className="sm:col-span-2 mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <p className="font-semibold">{costError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FIX: Moved "Explore by City" section here */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#0c2d48]">
            Explore by City
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {topCities.map((city) => (
              <Link
                key={city}
                to={`/city/${city.toLowerCase()}`}
                className="px-6 py-3 bg-white rounded-lg shadow hover:shadow-lg transition-shadow font-semibold text-[#145DA0]"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-xl font-bold text-gray-700 mb-6">
          Showing {totalFilteredHomes} results...
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {homesWithAds.map((item) =>
            item.isAd ? (
              <div key={item.id} className="md:col-span-2 lg:col-span-3">
                <AdSense slot={process.env.REACT_APP_ADSENSE_SLOT_ID_1} />
              </div>
            ) : (
              <HomeCard
                key={item.id}
                home={item}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={onToggleFavorite}
              />
            )
          )}
        </div>
        {filteredHomes.length === 0 && !costError && (
          <div className="text-center py-20 bg-white rounded-lg shadow-md col-span-full">
            <h3 className="font-heading text-3xl font-semibold text-gray-800">
              No Homes Found
            </h3>
            <p className="text-gray-500 mt-2 text-lg">
              Please try adjusting your search or filters.
            </p>
          </div>
        )}
        <Pagination
          currentPage={listPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
};

export default HomePage;
