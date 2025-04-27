import { SVGOverlay } from "react-leaflet";
import { latLngBounds } from "leaflet";
import React, { useMemo } from "react";
import { convertCoordinates } from "../lib/parcel/converters";
import { Parcel } from "../lib/parcel/Parcel";

const ParcelLabel = ({
  parcel,
  labelFontSize,
}: {
  parcel: Parcel;
  labelFontSize: number;
}) => {
  if (!parcel?.rings) return null;

  const bounds = useMemo(() => {
    const b = latLngBounds(convertCoordinates(parcel.rings));
    return b;
  }, [parcel.rings]);

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
        {parcel.siteAddressNumber}
      </text>
    </SVGOverlay>
  );
};

export default ParcelLabel;
