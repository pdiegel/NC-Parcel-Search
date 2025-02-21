import { MapContainer, Polygon, Popup, useMap } from "react-leaflet";
import React, { useState, useEffect, useRef } from "react";
import proj4 from "proj4";
import { latLngBounds } from "leaflet";
import {
  numToTwoDecimals,
  extractFullSiteAddress,
} from "../helpers/formatHelpers";
import { countyGISMap } from "../helpers/fields";
import { Parcel } from "../types/Parcel";
import SidePanel from "./SidePanel";
import { convertCoordinates } from "../helpers/converters";
import ParcelLabel from "./ParcelLabel";
import { ActiveTileLayer, tileLayers } from "./ActiveTileLayer";

// Define NC State Plane (EPSG:102719 → EPSG:4326)
proj4.defs(
  "EPSG:102719",
  "+proj=lcc +lat_1=36.16666666666666 +lat_2=34.33333333333334 +lat_0=33.75 +lon_0=-79 +x_0=609601.22 +y_0=0 +datum=NAD83 +units=us-ft +no_defs"
);

const MapZoomHandler = ({ selectedParcel }: { selectedParcel: Parcel }) => {
  const map = useMap();

  useEffect(() => {
    if (
      selectedParcel &&
      selectedParcel.geometry &&
      selectedParcel.geometry.rings
    ) {
      const polygonCoordinates = convertCoordinates(
        selectedParcel.geometry.rings
      );
      map.fitBounds(latLngBounds(polygonCoordinates)); // Fit map to selected parcel
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
  const selectedParcelRef = useRef(null as any);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedParcelRef.current) {
        selectedParcelRef.current.bringToFront();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedParcel, nearbyParcels, tileLayer]);
  return (
    <>
      {selectedParcel &&
        selectedParcel.attributes &&
        selectedParcel.attributes.parno && (
          <SidePanel
            selectedParcel={selectedParcel}
            closePanel={() => setSelectedParcel({} as Parcel)}
          />
        )}

      <div className="layer-toggle">
        <strong>Layer:</strong>
        <ul>
          {/* Display buttons for each tile layer */}
          {tileLayers &&
            Object.keys(tileLayers).map((layer) => (
              <li key={layer}>
                <button onClick={() => setTileLayer(layer)}>
                  {layer[0].toUpperCase() + layer.slice(1)}
                </button>
              </li>
            ))}
        </ul>
      </div>
      <MapContainer
        center={[35.7796, -78.6382]}
        zoom={12}
        maxZoom={19}
        style={{ height: "100vh", width: "100%" }}
      >
        <ActiveTileLayer tileLayer={tileLayer} />

        {/* Display nearby parcels */}
        {nearbyParcels.map(
          (parcel, index) =>
            parcel.geometry?.rings && (
              <div key={`${parcel.attributes.parno}-${index}`}>
                <ParcelLabel parcel={parcel} labelFontSize={"18px"} />
                <Polygon
                  key={index}
                  positions={convertCoordinates(parcel.geometry.rings)}
                  color="#90EE91"
                  weight={1}
                  fillOpacity={0.1}
                  smoothFactor={1}
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
                    Acres: {numToTwoDecimals(parcel.attributes.gisacres)}
                    <br />
                    County: {parcel.attributes.cntyname}
                    <br />
                    {parcel.attributes.sourceref && (
                      <>
                        {parcel.attributes.sourceref}
                        <br />
                      </>
                    )}
                    {countyGISMap[parcel.attributes.cntyname] && (
                      <>
                        <a
                          href={countyGISMap[parcel.attributes.cntyname]}
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

        {/* Display selected parcel */}
        {selectedParcel &&
          selectedParcel.geometry &&
          selectedParcel.geometry.rings && (
            <>
              <MapZoomHandler selectedParcel={selectedParcel} />
              <ParcelLabel parcel={selectedParcel} labelFontSize={"30px"} />
              <Polygon
                ref={selectedParcelRef}
                positions={convertCoordinates(selectedParcel.geometry.rings)}
                color="#6593B1"
                weight={3}
                smoothFactor={1}
              ></Polygon>
            </>
          )}
      </MapContainer>
    </>
  );
};

export default ParcelMap;
