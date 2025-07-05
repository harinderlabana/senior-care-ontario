// In src/components/pages/CityPage.js
import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import HomeCard from "../home/HomeCard";
import Meta from "../common/Meta";
import Pagination from "../common/Pagination";
import { cityData } from "../../data/cityData"; // Import the new city data

const ITEMS_PER_PAGE = 15;

const CityPage = ({ allHomes, favorites, onToggleFavorite }) => {
  const { cityName } = useParams();
  const [listPage, setListPage] = useState(1);

  // Get the unique data for the current city
  const currentCityData = cityData[cityName.toLowerCase()];

  const cityHomes = useMemo(() => {
    return allHomes.filter(
      (home) =>
        home && home.city && home.city.toLowerCase() === cityName.toLowerCase()
    );
  }, [allHomes, cityName]);

  const capitalizedCityName = useMemo(() => {
    if (!cityName) return "";
    return cityName.charAt(0).toUpperCase() + cityName.slice(1);
  }, [cityName]);

  const totalPages = Math.ceil(cityHomes.length / ITEMS_PER_PAGE);
  const paginatedHomes = cityHomes.slice(
    (listPage - 1) * ITEMS_PER_PAGE,
    listPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (pageNumber) => {
    setListPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <main className="animate-fade-in">
      <Meta
        title={`Senior Care in ${capitalizedCityName} | SeniorCare Ontario`}
        description={`Browse our comprehensive directory of retirement and long-term care homes in the ${capitalizedCityName}, Ontario area.`}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/" className="text-[#145DA0] hover:underline">
            &larr; Back to Main Directory
          </Link>
        </div>

        {/* New Content Sections */}
        {currentCityData && (
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#0c2d48] mb-4">
              Senior Living in {capitalizedCityName}
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              {currentCityData.about}
            </p>

            <div className="mt-8 grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#0c2d48] mb-3">
                  Local Cost Analysis
                </h2>
                <p className="text-gray-700 mb-2">
                  <strong>Retirement Homes:</strong> Approx. $
                  {currentCityData.costs.retirement.min.toLocaleString()} - $
                  {currentCityData.costs.retirement.max.toLocaleString()}/month
                </p>
                <p className="text-gray-700">
                  <strong>Long-Term Care (Co-payment):</strong> Starts at
                  approx. $
                  {currentCityData.costs.longTermCare.basic.toLocaleString()}
                  /month for a basic room.
                </p>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#0c2d48] mb-3">
                  Local Health Network
                </h2>
                <p className="text-gray-700">
                  {currentCityData.healthNetwork.description}
                </p>
              </div>
            </div>
          </div>
        )}

        <h2 className="font-heading text-3xl font-bold text-[#0c2d48] mb-8">
          Listings for {capitalizedCityName}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedHomes.map((home) => (
            <HomeCard
              key={home.id}
              home={home}
              isFavorite={favorites.includes(home.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
        <Pagination
          currentPage={listPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
};

export default CityPage;
