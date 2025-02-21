import { SVGOverlay } from "react-leaflet";
import { latLngBounds } from "leaflet";
import React from "react";
import { Parcel } from "../types/Parcel";
import { convertCoordinates } from "../helpers/converters";
import { extractAddressNumber } from "../helpers/formatHelpers";

const ParcelLabel = ({ parcel }: { parcel: Parcel }) => {
  if (!parcel?.geometry?.rings) return null;

  const bounds = latLngBounds(convertCoordinates(parcel.geometry.rings));

  return (
    <SVGOverlay bounds={bounds} className="svg-holder">
      <text
        x="50%"
        y="50%"
        fill="#eee"
        stroke="black"
        strokeWidth={0.5}
        style={{ fontSize: "20px", fontWeight: "bold" }}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {extractAddressNumber(parcel.attributes.siteadd)}
      </text>
    </SVGOverlay>
  );
};

export default React.memo(ParcelLabel); // Memoized for performance
