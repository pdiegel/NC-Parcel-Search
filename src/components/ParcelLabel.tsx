import { SVGOverlay } from "react-leaflet";
import { latLngBounds } from "leaflet";
import React from "react";
import { Parcel } from "../types/Parcel";
import { convertCoordinates } from "../lib/parcel/converters";
import {
  extractAddressNumber,
  extractFullSiteAddress,
} from "../lib/parcel/formatHelpers";

const ParcelLabel = ({
  parcel,
  labelFontSize,
}: {
  parcel: Parcel;
  labelFontSize: number;
}) => {
  if (!parcel?.geometry?.rings) return null;

  const bounds = latLngBounds(convertCoordinates(parcel.geometry.rings));

  return (
    <SVGOverlay bounds={bounds} className="svg-holder">
      <text
        x={`50%`}
        y={`50%`}
        fill="#eee"
        style={{ fontSize: labelFontSize, fontWeight: "bold" }}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {extractAddressNumber(extractFullSiteAddress(parcel))}
      </text>
    </SVGOverlay>
  );
};

export default React.memo(ParcelLabel, (prev, next) => {
  return (
    prev.parcel.attributes.objectid === next.parcel.attributes.objectid &&
    prev.labelFontSize === next.labelFontSize
  );
});
