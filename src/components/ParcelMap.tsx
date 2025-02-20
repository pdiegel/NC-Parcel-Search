import { MapContainer, TileLayer, Polygon, Popup, useMap } from "react-leaflet";
import React, { useEffect } from "react";
import proj4 from "proj4";
import { latLngBounds } from "leaflet";
import { numToTwoDecimals } from "../helpers/formatHelpers";
import { countyGISMap } from "../helpers/fields";
import { Parcel } from "../types/Parcel";
import SidePanel from "./SidePanel";
import { convertCoordinates } from "../helpers/converters";
import ParcelLabel from "./ParcelLabel";

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
            <ParcelLabel parcel={selectedParcel} />
            <Polygon
              positions={convertCoordinates(selectedParcel.geometry.rings)}
              color="blue"
              weight={3}
            >
              <SidePanel
                selectedParcel={selectedParcel}
                closePanel={() => setSelectedParcel({} as Parcel)}
              />
            </Polygon>
          </>
        )}

      {/* Display nearby parcels */}
      {nearbyParcels.map(
        (parcel, index) =>
          parcel.geometry?.rings && (
            <div key={parcel.attributes.parno}>
              <ParcelLabel parcel={parcel} />
              <Polygon
                key={index}
                positions={convertCoordinates(parcel.geometry.rings)}
                color="green"
                weight={0.8}
                fillOpacity={0.1}
              >
                <Popup>
                  <strong>{parcel.attributes.ownname}</strong>
                  <br />
                  Site Address:{" "}
                  {parcel.attributes.siteadd ||
                    `${parcel.attributes.maddpref} ${parcel.attributes.saddpref} ${parcel.attributes.saddno} ${parcel.attributes.saddstr} ${parcel.attributes.saddsttyp} ${parcel.attributes.saddstsuf}`}
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
            </div>
          )
      )}
    </MapContainer>
  );
};

export default ParcelMap;
