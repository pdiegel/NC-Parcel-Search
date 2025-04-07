import React from "react";
import {
  numToTwoDecimals,
  extractFullSiteAddress,
  replaceStringPlaceholders,
} from "../lib/parcel/formatHelpers";
import { COUNTY_GIS_MAP } from "../lib/constants";
import { Parcel } from "../types/Parcel";

const SidePanel = ({
  selectedParcel,
  closePanel,
}: {
  selectedParcel: Parcel;
  closePanel: () => void;
}) => {
  if (!selectedParcel) return null; // Hide if no parcel is selected

  return (
    <div className="side-panel">
      <button className="close-btn" onClick={closePanel}>
        ×
      </button>
      <h2>Parcel Details</h2>

      <p>
        <strong>Owner:</strong> {selectedParcel.attributes.ownname}
      </p>
      <p>
        <strong>Site Address:</strong> {extractFullSiteAddress(selectedParcel)}
      </p>
      <p>
        <strong>Parcel ID:</strong>{" "}
        {selectedParcel.attributes.parno || selectedParcel.attributes.altparno}
      </p>
      {selectedParcel.attributes.altparno &&
        selectedParcel.attributes.parno && (
          <p>
            <strong>Alternate Parcel ID:</strong>{" "}
            {selectedParcel.attributes.altparno}
          </p>
        )}
      <p>
        <strong>Acres:</strong>{" "}
        {(selectedParcel.attributes.gisacres > 0 &&
          numToTwoDecimals(selectedParcel.attributes.gisacres)) ||
          numToTwoDecimals(selectedParcel.attributes.recareano)}
      </p>
      <p>
        <strong>County:</strong> {selectedParcel.attributes.cntyname}
      </p>

      {selectedParcel.attributes.sourceref && (
        <p>
          <strong>Source Ref:</strong> {selectedParcel.attributes.sourceref}
        </p>
      )}

      {selectedParcel.attributes.mapref && (
        <p>
          <strong>Map Ref:</strong> {selectedParcel.attributes.mapref}
        </p>
      )}

      {COUNTY_GIS_MAP[selectedParcel.attributes.cntyname] && (
        <>
          <a
            href={replaceStringPlaceholders(
              COUNTY_GIS_MAP[selectedParcel.attributes.cntyname],
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
  );
};

export default SidePanel;
