import React, { useMemo, useState, useEffect } from "react";
import HomeCard from "./HomeCard";
import { SearchIcon } from "../common/Icons";
import Meta from "../common/Meta";
import Pagination from "../common/Pagination";
import AdSense from "../common/AdSense";

const HomePage = ({
  allHomes,
  filteredHomes,
  totalFilteredHomes,
  filters,
  searchTerm,
  onFilterChange,
  onSearchChange,
  onApplyFilters,
  onResetFilters,
  onViewDetails,
  favorites,
  onToggleFavorite,
  isShowingFavorites,
  costError,
  currentPage,
  totalPages,
  onPageChange,
  setPendingSearchTerm,
}) => {
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const allCities = useMemo(
    () =>
      [...new Set(allHomes.map((item) => item.city).filter(Boolean))].sort(),
    [allHomes]
  );

  useEffect(() => {
    if (searchTerm && searchTerm.length > 1) {
      const suggestions = allCities.filter((city) =>
        city.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      setCitySuggestions(suggestions);
    } else {
      setCitySuggestions([]);
    }
  }, [searchTerm, allCities]);

  const handleSuggestionClick = (city) => {
    setPendingSearchTerm(city);
    setShowSuggestions(false); // This hides the suggestion box
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
    for (let i = 0; i < filteredHomes.length; i++) {
      homesWithAds.push(filteredHomes[i]);
      if (i + 1 === 6) {
        homesWithAds.push({ isAd: true, id: `ad-${i}` });
      }
    }
    return homesWithAds;
  }, [filteredHomes]);

  return (
    <main>
      <Meta
        title="SeniorCare Ontario | Your Trusted Guide to Senior Care"
        description="Find the perfect retirement home or long-term care facility in Ontario. SeniorCare Ontario offers a trusted, comprehensive directory to help you find care with confidence."
      />
      <section className="bg-gradient-to-br from-[#145DA0] to-[#0c2d48] text-white py-16 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-4xl md:text-6xl font-black">
            The Right Care, The Right Home.
          </h2>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-white/90">
            Your journey to peace of mind starts here.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            <div className="lg:col-span-6 relative">
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
                value={searchTerm}
                onChange={onSearchChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
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
                value={filters.city}
                onChange={onFilterChange}
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
                value={filters.type}
                onChange={onFilterChange}
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
                value={filters.minCost}
                onChange={onFilterChange}
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
                value={filters.maxCost}
                onChange={onFilterChange}
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
            <button
              onClick={onApplyFilters}
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
          {costError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="font-semibold">{costError}</p>
            </div>
          )}
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-xl font-bold text-gray-700 mb-6">
          {isShowingFavorites
            ? `Showing ${totalFilteredHomes} homes in your shortlist`
            : `Showing ${totalFilteredHomes} results...`}
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
                onViewDetails={onViewDetails}
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
              {isShowingFavorites
                ? "You haven't added any homes to your shortlist yet."
                : "Please try adjusting your search or filters."}
            </p>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </main>
  );
};

export default HomePage;
