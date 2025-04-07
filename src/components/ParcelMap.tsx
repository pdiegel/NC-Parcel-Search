import { MapContainer, Polygon, Popup, useMap } from "react-leaflet";
import React, { useState, useEffect, useRef } from "react";
import proj4 from "proj4";
import { latLngBounds } from "leaflet";
import {
  numToTwoDecimals,
  extractFullSiteAddress,
  replaceStringPlaceholders,
} from "../lib/parcel/formatHelpers";
import { COUNTY_GIS_MAP } from "../lib/constants";
import { Parcel } from "../types/Parcel";
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
    if (selectedParcel?.geometry?.rings) {
      const polygonCoordinates = convertCoordinates(
        selectedParcel.geometry.rings
      );
      map.fitBounds(latLngBounds(polygonCoordinates));
    }
  }, [selectedParcel, map]);

  return null;
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
    const timer = setTimeout(() => {
      if (selectedParcelRef.current) {
        (selectedParcelRef.current as any).bringToFront();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedParcel, nearbyParcels, tileLayer]);

  return (
    <>
      {selectedParcel?.attributes?.parno && (
        <SidePanel
          selectedParcel={selectedParcel}
          closePanel={() => setSelectedParcel({} as Parcel)}
        />
      )}

      <div className="layer-toggle">
        <strong>Layer:</strong>
        <ul>
          {Object.keys(tileLayers).map((layer) => (
            <li key={layer}>
              <button onClick={() => setTileLayer(layer)}>
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
            parcel.geometry?.rings && (
              <div key={`${parcel.attributes.parno}-${index}`}>
                <ParcelLabel
                  parcel={parcel}
                  labelFontSize={LABEL_FONT_SIZE}
                  mapCurrentZoom={mapZoom}
                />
                <Polygon
                  key={index}
                  positions={convertCoordinates(parcel.geometry.rings)}
                  color="#228B22"
                  weight={1}
                  fillOpacity={0.1}
                  smoothFactor={2}
                >
                  <Popup>
                    <strong>{parcel.attributes.ownname}</strong>
                    <br />
                    Site Address:{" "}
                    {extractFullSiteAddress(parcel) || "No Address Found"}
                    <br />
                    Parcel ID:{" "}
                    {parcel.attributes.parno || parcel.attributes.altparno}
                    <br />
                    Acres:{" "}
                    {(parcel.attributes.gisacres > 0 &&
                      numToTwoDecimals(parcel.attributes.gisacres)) ||
                      numToTwoDecimals(parcel.attributes.recareano)}
                    <br />
                    County: {parcel.attributes.cntyname}
                    <br />
                    {parcel.attributes.sourceref && (
                      <>
                        {parcel.attributes.sourceref}
                        <br />
                      </>
                    )}
                    {COUNTY_GIS_MAP[parcel.attributes.cntyname] && (
                      <>
                        <a
                          href={replaceStringPlaceholders(
                            COUNTY_GIS_MAP[parcel.attributes.cntyname],
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
              labelFontSize={LABEL_FONT_SIZE}
              mapCurrentZoom={mapZoom}
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
