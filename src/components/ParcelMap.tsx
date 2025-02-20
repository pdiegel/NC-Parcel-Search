import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  useMap,
  SVGOverlay,
} from "react-leaflet";
import React, { useEffect } from "react";
import proj4 from "proj4";
import { latLngBounds, LatLngExpression } from "leaflet";
import { numToTwoDecimals } from "../helpers/formatHelpers";
import { countyGISMap } from "../helpers/fields";
import { Parcel } from "../types/Parcel";
import { Ring } from "../types/Ring";

// Define NC State Plane (EPSG:102719 → EPSG:4326)
proj4.defs(
  "EPSG:102719",
  "+proj=lcc +lat_1=36.16666666666666 +lat_2=34.33333333333334 +lat_0=33.75 +lon_0=-79 +x_0=609601.22 +y_0=0 +datum=NAD83 +units=us-ft +no_defs"
);

const convertCoordinates = (rings: Ring[]): LatLngExpression[] => {
  return rings.flatMap((ring) =>
    ring.map((coords) => {
      const [lon, lat] = proj4("EPSG:102719", "EPSG:4326", coords);
      return [lat, lon] as LatLngExpression;
    })
  );
};

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
  return (
    <MapContainer
      center={[35.7796, -78.6382]}
      zoom={12}
      maxZoom={19}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        maxZoom={19}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {selectedParcel &&
        selectedParcel.geometry &&
        selectedParcel.geometry.rings && (
          <>
            <MapZoomHandler selectedParcel={selectedParcel} />
            <SVGOverlay
              bounds={latLngBounds(
                convertCoordinates(selectedParcel.geometry.rings)
              )}
              className="svg-holder"
            >
              <text
                id="pid"
                x="50%"
                y="50%"
                fill="black"
                stroke="white"
                strokeWidth={0.01}
                fontSize={12}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {selectedParcel.attributes.parno ||
                  selectedParcel.attributes.altparno}
              </text>
            </SVGOverlay>
            <Polygon
              positions={convertCoordinates(selectedParcel.geometry.rings)}
              color="blue"
              weight={3}
            >
              <Popup>
                <strong>{selectedParcel.attributes.ownname}</strong>
                <br />
                Site Address: {selectedParcel.attributes.siteadd}
                <br />
                Parcel ID:{" "}
                {selectedParcel.attributes.parno ||
                  selectedParcel.attributes.altparno}
                <br />
                Acres: {numToTwoDecimals(selectedParcel.attributes.gisacres)}
                <br />
                County: {selectedParcel.attributes.cntyname}
                <br />
                {selectedParcel.attributes.sourceref && (
                  <>
                    {selectedParcel.attributes.sourceref}
                    <br />
                  </>
                )}
                <a
                  href={countyGISMap[selectedParcel.attributes.cntyname]}
                  target="_blank"
                >
                  County GIS
                </a>
              </Popup>
            </Polygon>
          </>
        )}

      {/* Display nearby parcels */}
      {nearbyParcels.map(
        (parcel, index) =>
          parcel.geometry?.rings && (
            <Polygon
              key={index}
              positions={convertCoordinates(parcel.geometry.rings)}
              color="green"
              weight={1}
              fillOpacity={0.2}
            >
              <Popup>
                <strong>{parcel.attributes.ownname}</strong>
                <br />
                Site Address: {parcel.attributes.siteadd}
                <br />
                Parcel ID:{" "}
                {parcel.attributes.parno || parcel.attributes.altparno}
                <br />
                Acres: {numToTwoDecimals(parcel.attributes.gisacres)}
                <br />
                County: {parcel.attributes.cntyname}
                <br />
                <a
                  href={countyGISMap[parcel.attributes.cntyname]}
                  target="_blank"
                >
                  County GIS
                </a>
                <br />
                <button onClick={() => setSelectedParcel(parcel)}>
                  Set Active
                </button>
              </Popup>
            </Polygon>
          )
      )}
    </MapContainer>
  );
};

export default ParcelMap;
