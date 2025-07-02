// In src/components/common/AdSense.js
import React, { useEffect } from "react";

const AdSense = ({ slot }) => {
  const client = process.env.REACT_APP_ADSENSE_CLIENT_ID;

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  if (!client || client === "ca-pub-XXXXXXXXXXXXXXXX") {
    return (
      <div className="bg-gray-200 rounded-lg flex items-center justify-center h-24 text-gray-500 my-6">
        Ad Placeholder
      </div>
    );
  }

  return (
    <div className="my-6">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdSense;
