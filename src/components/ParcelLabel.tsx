import { SVGOverlay } from "react-leaflet";
import { latLngBounds } from "leaflet";
import React, { useEffect, useState } from "react";
import { Parcel } from "../types/Parcel";
import { convertCoordinates } from "../lib/parcel/converters";
import { extractAddressNumber } from "../lib/parcel/formatHelpers";

const ParcelLabel = ({
  parcel,
  labelFontSize,
  mapCurrentZoom,
}: {
  parcel: Parcel;
  labelFontSize: number;
  mapCurrentZoom: number;
}) => {
  if (!parcel?.geometry?.rings) return null;

  const bounds = latLngBounds(convertCoordinates(parcel.geometry.rings));
  const [newLabelFontSize, setNewLabelFontSize] = useState(labelFontSize);

  useEffect(() => {
    // Reduce the font size by 8px for each zoom level below 18
    setNewLabelFontSize(Math.max(0, 18 - (18 - mapCurrentZoom) * 5));
  }, [mapCurrentZoom]);

  return (
    <SVGOverlay bounds={bounds} className="svg-holder">
      <text
        x="50%"
        y="50%"
        fill="#eee"
        style={{ fontSize: newLabelFontSize, fontWeight: "bold" }}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {extractAddressNumber(parcel.attributes.siteadd)}
      </text>
    </SVGOverlay>
  );
};

export default React.memo(ParcelLabel); // Memoized for performance
