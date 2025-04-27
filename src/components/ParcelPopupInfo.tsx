import React from "react";
import { Parcel } from "../lib/parcel/Parcel";
import { Popup } from "react-leaflet";
import { COUNTY_GIS_MAP } from "../lib/constants";
import { replaceStringPlaceholders } from "../lib/parcel/formatHelpers";

const ParcelPopupInfo = ({
  parcel,
  setSelectedParcel,
}: {
  parcel: Parcel;
  setSelectedParcel: (parcel: Parcel) => void;
}) => {
  return (
    <Popup>
      <h4>Parcel Details</h4>
      <ul className="parcel-popup">
        <li>Site Address: {parcel.siteAddress || "No Address Found"}</li>
        <li>Parcel ID: {parcel.validParcelNumber}</li>
        <li>Owner Name: {parcel.ownerName}</li>
        <li>Acres: {parcel.acreage ? parcel.acreage : "N/A"}</li>
        <li>County: {parcel.county}</li>
        {parcel.deedRef && (
          <li>
            Deed: Book {parcel.deedBook}, Page {parcel.deedPage}
          </li>
        )}
        {COUNTY_GIS_MAP[parcel.county] && (
          <a
            href={replaceStringPlaceholders(
              COUNTY_GIS_MAP[parcel.county],
              parcel.attributes
            )}
            target="_blank"
          >
            County GIS
          </a>
        )}
        <button onClick={() => setSelectedParcel(parcel)}>Set Active</button>
      </ul>
    </Popup>
  );
};

export default ParcelPopupInfo;
