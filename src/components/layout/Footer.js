import React from "react";

const Footer = () => (
  <footer className="bg-[#0c2d48] text-white mt-16">
    <div className="container mx-auto px-8 py-10 text-center text-gray-300">
      <p className="font-heading font-semibold text-xl">SeniorCare Ontario</p>
      <p className="text-sm text-gray-400 mt-1">
        &copy; {new Date().getFullYear()}. Compassion and clarity in senior
        living.
      </p>
    </div>
  </footer>
);

export default Footer;
