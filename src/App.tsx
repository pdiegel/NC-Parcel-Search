import React, { useState, useEffect } from "react";
import ParcelSearch from "./components/ParcelSearch";
import ParcelMap from "./components/ParcelMap";
import { getFieldData, getNearbyParcels } from "./api/ncParcels";
import { Analytics } from "@vercel/analytics/react";
import { Field } from "./types/Field";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [fieldTypes, setFieldTypes] = useState([] as Field[]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [nearbyParcels, setNearbyParcels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data: Field[] = await getFieldData();
      setFieldTypes(data);
    };

    fetchData();
  }, []);

  const handleParcelSelect = async (parcel) => {
    setSelectedParcel(parcel);
    const nearby = await getNearbyParcels(parcel);
    setNearbyParcels(nearby);
  };

  const isLoading = !fieldTypes.length;

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="loading-screen"
        >
          <img
            src={
              "https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/abfa05c49acf005b8b1e0ef8eb25a67a7057eb20/svg-css/bars-scale-middle.svg"
            }
            alt="Loading..."
          />
        </motion.div>
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="main-app"
        >
          <Analytics />
          <div>
            <ParcelSearch
              fieldData={fieldTypes}
              setSelectedParcel={handleParcelSelect}
            />
            <ParcelMap
              selectedParcel={selectedParcel}
              nearbyParcels={nearbyParcels}
              setSelectedParcel={handleParcelSelect}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
