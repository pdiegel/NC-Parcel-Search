import React, { useState, useEffect } from "react";
import { replaceStringPlaceholders } from "../lib/parcel/formatHelpers";
import { COUNTY_GIS_MAP } from "../lib/constants";
import { Parcel } from "../lib/parcel/Parcel";

const SidePanel = ({ selectedParcel }: { selectedParcel: Parcel }) => {
  const [isOpen, setIsOpen] = useState(true);
  if (!selectedParcel) return null; // Hide if no parcel is selected

  useEffect(() => {
    setIsOpen(true); // Open the side panel when a new parcel is selected
  }, [selectedParcel]);

  return (
    <>
      <button
        className={`toggle-btn ${isOpen ? "open" : "closed"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        Parcel Details
      </button>
      <div className={`side-panel ${isOpen ? "open" : "closed"}`}>
        <button className="close-btn" onClick={() => setIsOpen(!isOpen)}>
          ×
        </button>
        <h2>Parcel Details</h2>

        <p>
          <strong>Owner:</strong> {selectedParcel.ownerName}
        </p>
        <p>
          <strong>Site Address:</strong> {selectedParcel.siteAddress}
        </p>
        <p>
          <strong>Parcel ID:</strong> {selectedParcel.validParcelNumber}
        </p>
        {selectedParcel.validParcelNumber === selectedParcel.mainParcelNumber &&
          selectedParcel.alternateParcelNumber && (
            <p>
              <strong>Alternate Parcel ID:</strong>{" "}
              {selectedParcel.alternateParcelNumber}
            </p>
          )}
        <p>
          <strong>Acres:</strong> {selectedParcel.acreage}
        </p>
        <p>
          <strong>County:</strong> {selectedParcel.county}
        </p>

        {selectedParcel.deedRef && (
          <p>
            <strong>Source Ref:</strong> {selectedParcel.deedRef}
          </p>
        )}

        {selectedParcel.platRef && (
          <p>
            <strong>Map Ref:</strong> {selectedParcel.platRef}
          </p>
        )}

        {COUNTY_GIS_MAP[selectedParcel.county] && (
          <>
            <a
              href={replaceStringPlaceholders(
                COUNTY_GIS_MAP[selectedParcel.county],
                selectedParcel.attributes
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              County GIS
            </a>
            <br />
          </>
        )}
      </div>
    </>
  );
};

export default SidePanel;
