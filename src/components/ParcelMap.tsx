import { MapContainer, Polygon, Popup, useMap } from "react-leaflet";
import React, { useState, useEffect, useRef } from "react";
import proj4 from "proj4";
import { latLngBounds } from "leaflet";
import { replaceStringPlaceholders } from "../lib/parcel/formatHelpers";
import { COUNTY_GIS_MAP } from "../lib/constants";
import { Parcel } from "../lib/parcel/Parcel";
import SidePanel from "./SidePanel";
import { convertCoordinates } from "../lib/parcel/converters";
import ParcelLabel from "./ParcelLabel";
import { ActiveTileLayer, tileLayers } from "./ActiveTileLayer";
import {
  DEFAULT_ZOOM,
  MAX_ZOOM,
  STARTING_COORDINATES,
  LABEL_FONT_SIZE,
} from "../lib/constants";

// Define NC State Plane (EPSG:102719 → EPSG:4326)
proj4.defs(
  "EPSG:102719",
  "+proj=lcc +lat_1=36.16666666666666 +lat_2=34.33333333333334 +lat_0=33.75 +lon_0=-79 +x_0=609601.22 +y_0=0 +datum=NAD83 +units=us-ft +no_defs"
);

const MapZoomTracker = ({
  onZoomChange,
}: {
  onZoomChange: (zoom: number) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    const updateZoom = () => onZoomChange(map.getZoom());
    updateZoom(); // set initial zoom
    map.on("zoomend", updateZoom);
    return () => {
      map.off("zoomend", updateZoom);
    };
  }, [map, onZoomChange]);

  return null;
};

const MapZoomHandler = ({ selectedParcel }: { selectedParcel: Parcel }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedParcel?.rings) {
      const polygonCoordinates = convertCoordinates(selectedParcel?.rings);
      map.fitBounds(latLngBounds(polygonCoordinates));
    }
  }, [selectedParcel, map]);

  return null;
};

const getFontSizeFromZoom = (zoom: number): number => {
  return Math.max(0, LABEL_FONT_SIZE - (LABEL_FONT_SIZE - zoom) * 5);
};

const ParcelMap = ({
  selectedParcel,
  nearbyParcels,
  setSelectedParcel,
}: {
  selectedParcel: Parcel | null;
  nearbyParcels: Parcel[];
  setSelectedParcel: (parcel: Parcel) => void;
}) => {
  const [tileLayer, setTileLayer] = useState("street");
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const selectedParcelRef = useRef(null);

  useEffect(() => {
    // Brings the selected parcel above the nearby parcels
    const timer = setTimeout(() => {
      if (selectedParcelRef.current) {
        (selectedParcelRef.current as any).bringToFront();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [nearbyParcels]);

  return (
    <>
      {selectedParcel?.validParcelNumber && (
        <SidePanel selectedParcel={selectedParcel} />
      )}

      <div className="layer-toggle">
        <strong>Layer:</strong>
        <ul>
          {Object.keys(tileLayers).map((layer) => (
            <li key={layer}>
              <button onClick={() => setTileLayer(layer)}>
                {/* Capitalizing the layer/basemap names */}
                {layer[0].toUpperCase() + layer.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <MapContainer
        center={STARTING_COORDINATES}
        zoom={DEFAULT_ZOOM}
        maxZoom={MAX_ZOOM}
        style={{ height: "100vh", width: "100%" }}
      >
        <MapZoomTracker onZoomChange={setMapZoom} />
        <ActiveTileLayer tileLayer={tileLayer} />

        {nearbyParcels.map(
          (parcel, index) =>
            parcel.rings && (
              <div key={`${parcel.mainParcelNumber}-${index}`}>
                <ParcelLabel
                  parcel={parcel}
                  labelFontSize={getFontSizeFromZoom(mapZoom)}
                />
                <Polygon
                  key={index}
                  positions={convertCoordinates(parcel.rings)}
                  color="#228B22"
                  weight={1}
                  fillOpacity={0.1}
                  smoothFactor={1}
                >
                  <Popup>
                    <strong>{parcel.ownerName}</strong>
                    <br />
                    Site Address: {parcel.siteAddress || "No Address Found"}
                    <br />
                    Parcel ID: {parcel.validParcelNumber}
                    <br />
                    Acres: {parcel.acreage ? parcel.acreage : "N/A"}
                    <br />
                    County: {parcel.county}
                    <br />
                    {parcel.deedRef && (
                      <>
                        {parcel.deedRef}
                        <br />
                      </>
                    )}
                    {COUNTY_GIS_MAP[parcel.county] && (
                      <>
                        <a
                          href={replaceStringPlaceholders(
                            COUNTY_GIS_MAP[parcel.county],
                            parcel.attributes
                          )}
                          target="_blank"
                        >
                          County GIS
                        </a>
                        <br />
                      </>
                    )}
                    <button onClick={() => setSelectedParcel(parcel)}>
                      Set Active
                    </button>
                  </Popup>
                </Polygon>
              </div>
            )
        )}

        {selectedParcel?.geometry?.rings && (
          <>
            <MapZoomHandler selectedParcel={selectedParcel} />
            <ParcelLabel
              parcel={selectedParcel}
              labelFontSize={getFontSizeFromZoom(mapZoom)}
            />
            <Polygon
              ref={selectedParcelRef}
              positions={convertCoordinates(selectedParcel.geometry.rings)}
              color="#6593B1"
              weight={3}
              smoothFactor={1}
            />
          </>
        )}
      </MapContainer>
    </>
  );
};

export default ParcelMap;
