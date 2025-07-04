// In src/components/pages/CityPage.js
import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import HomeCard from "../home/HomeCard";
import Meta from "../common/Meta";
import Pagination from "../common/Pagination";

const ITEMS_PER_PAGE = 15;

const CityPage = ({ allHomes, favorites, onToggleFavorite }) => {
  const { cityName } = useParams();
  const [listPage, setListPage] = useState(1);

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
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#0c2d48] mb-4">
          Senior Care in {capitalizedCityName}
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl">
          Finding the right care in {capitalizedCityName} is an important step.
          Below is a complete list of all the retirement and long-term care
          homes available in the area. Use this directory to compare options,
          view photos, and find the perfect fit for your family.
        </p>
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
