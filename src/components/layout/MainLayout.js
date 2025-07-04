// In src/components/layout/MainLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout = ({ favoritesCount }) => (
  <>
    <Header favoritesCount={favoritesCount} />
    <main>
      <Outlet />{" "}
      {/* This is where the routed page component will be rendered */}
    </main>
    <Footer />
  </>
);

export default MainLayout;
