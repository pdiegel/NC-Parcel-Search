import React, { useState } from "react";
import ParcelSearch from "./components/ParcelSearch";
import ParcelMap from "./components/ParcelMap";
import { getNearbyParcels } from "./api/ncParcels";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [nearbyParcels, setNearbyParcels] = useState([]);

  const handleParcelSelect = async (parcel) => {
    setSelectedParcel(parcel);
    const nearby = await getNearbyParcels(parcel);
    setNearbyParcels(nearby);
  };

  return (
    <>
      <Analytics />
      <div>
        <ParcelSearch setSelectedParcel={handleParcelSelect} />
        <ParcelMap
          selectedParcel={selectedParcel}
          nearbyParcels={nearbyParcels}
          setSelectedParcel={handleParcelSelect}
        />
      </div>
    </>
  );
}

export default App;
