import React, { useState, useEffect } from "react";
import { replaceStringPlaceholders } from "../lib/parcel/formatHelpers";
import { COUNTY_GIS_MAP } from "../lib/constants";
import { Parcel } from "../lib/parcel/Parcel";
import UserIcon from "./Icons/UserIcon";
import ParcelDetail from "./ParcelDetail";
import IDIcon from "./Icons/IDIcon";
import MapPinIcon from "./Icons/MapPinIcon";
import CountyIcon from "./Icons/CountyIcon";
import AreaIcon from "./Icons/AreaIcon";
import DocumentIcon from "./Icons/DocumentIcon";
import RightArrowIcon from "./Icons/RightArrowIcon";
import LeftArrowIcon from "./Icons/LeftArrowIcon";

const SidePanel = ({ selectedParcel }: { selectedParcel: Parcel }) => {
  const [isOpen, setIsOpen] = useState(true);
  if (!selectedParcel) return null; // Hide if no parcel is selected

  useEffect(() => {
    setIsOpen(true); // Open the side panel when a new parcel is selected
  }, [selectedParcel]);

  return (
    <>
      <div className={`side-panel ${isOpen ? "open" : "closed"}`}>
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <RightArrowIcon /> : <LeftArrowIcon />}
        </button>
        <h2>Parcel Details</h2>

        <ul className="parcel-info">
          {/* ParcelDetail is a list item */}
          <ParcelDetail
            icon={<MapPinIcon />}
            title="Site Address"
            value={selectedParcel.siteAddress}
          />
          <ParcelDetail
            icon={<IDIcon />}
            title="Parcel ID"
            value={selectedParcel.validParcelNumber}
          />

          {selectedParcel.shouldShowAlternateParcelNumber() && (
            <ParcelDetail
              icon={<IDIcon />}
              title="Alternate Parcel ID"
              value={selectedParcel.alternateParcelNumber}
            />
          )}
          <ParcelDetail
            icon={<UserIcon />}
            title="Owner Name"
            value={selectedParcel.ownerName}
          />
          <ParcelDetail
            icon={<CountyIcon />}
            title="County"
            value={selectedParcel.county}
          />
          <ParcelDetail
            icon={<AreaIcon />}
            title="Area"
            value={`${selectedParcel.acreage} Acres`}
          />
          {selectedParcel.deedRef && (
            <ParcelDetail
              icon={<DocumentIcon />}
              title="Deed"
              value={`Book ${selectedParcel.deedBook}, Page ${selectedParcel.deedPage}`}
            />
          )}

          {selectedParcel.platRef && (
            <ParcelDetail
              icon={<DocumentIcon />}
              title="Plat"
              value={`Book ${selectedParcel.platBook}, Page ${selectedParcel.platPage}`}
            />
          )}
        </ul>

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
