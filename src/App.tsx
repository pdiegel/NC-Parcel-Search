import React, { useState, useEffect } from "react";
import ParcelSearch from "./components/ParcelSearch";
import ParcelMap from "./components/ParcelMap";
import { getFieldData, getNearbyParcels } from "./api/ncParcels";
import { Analytics } from "@vercel/analytics/react";
import { Field } from "./types/Field";
import { motion, AnimatePresence } from "framer-motion";
import { Parcel } from "./lib/parcel/Parcel";
import { ParcelData } from "./types/ParcelData";

function App() {
  const [fieldTypes, setFieldTypes] = useState([] as Field[]);
  const [selectedParcelData, setSelectedParcelData] = useState(
    {} as ParcelData
  );
  const [nearbyParcels, setNearbyParcels] = useState([] as Parcel[]);

  useEffect(() => {
    const fetchData = async () => {
      const data: Field[] = await getFieldData();
      setFieldTypes(data);
    };

    fetchData();
  }, []);

  const handleParcelSelect = async (parcel: ParcelData) => {
    setSelectedParcelData(parcel);
    const nearby = await getNearbyParcels(parcel);
    const newNearbyParcels = nearby.map((p: ParcelData) => new Parcel(p));
    setNearbyParcels(newNearbyParcels);
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
              selectedParcel={
                selectedParcelData?.attributes
                  ? new Parcel(selectedParcelData)
                  : null
              }
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
