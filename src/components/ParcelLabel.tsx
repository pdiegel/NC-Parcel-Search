import { SVGOverlay } from "react-leaflet";
import { latLngBounds } from "leaflet";
import React from "react";
import { Parcel } from "../types/Parcel";
import { convertCoordinates } from "../helpers/converters";

const ParcelLabel = ({ parcel }: { parcel: Parcel }) => {
  if (!parcel?.geometry?.rings) return null;

  const bounds = latLngBounds(convertCoordinates(parcel.geometry.rings));

  return (
    <SVGOverlay bounds={bounds} className="svg-holder">
      <text
        x="50%"
        y="50%"
        fill="black"
        stroke="white"
        strokeWidth={0.01}
        fontSize={12}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {parcel.attributes.saddno || ""}
      </text>
    </SVGOverlay>
  );
};

export default React.memo(ParcelLabel); // Memoized for performance
