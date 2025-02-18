import { MapContainer, TileLayer, Polygon, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import proj4 from "proj4";
import { numToTwoDecimals } from "../helpers/formatHelpers";
import { countyGISMap } from "../helpers/fields";

// Define NC State Plane (EPSG:102719 → EPSG:4326)
proj4.defs("EPSG:102719", "+proj=lcc +lat_1=36.16666666666666 +lat_2=34.33333333333334 +lat_0=33.75 +lon_0=-79 +x_0=609601.22 +y_0=0 +datum=NAD83 +units=us-ft +no_defs");

const convertCoordinates = (rings) => {
    return rings.map(ring =>
        ring.map(coords => {
            const [lon, lat] = proj4("EPSG:102719", "EPSG:4326", coords);
            return [lat, lon]; // Swap to Leaflet format [lat, lon]
        })
    );
};

const MapZoomHandler = ({ selectedParcel }) => {
    const map = useMap();

    useEffect(() => {
        if (selectedParcel && selectedParcel.geometry && selectedParcel.geometry.rings) {
            const polygonCoordinates = convertCoordinates(selectedParcel.geometry.rings);
            if (polygonCoordinates.length > 0) {
                map.fitBounds(polygonCoordinates[0]); // Fit map to selected parcel
            }
        }
    }, [selectedParcel, map]);

    return null;
};

const ParcelMap = ({ selectedParcel, nearbyParcels }) => {
    return (
        <MapContainer center={[35.7796, -78.6382]} zoom={10} style={{ height: "100vh", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {selectedParcel && selectedParcel.geometry && selectedParcel.geometry.rings && (
                <>
                    <MapZoomHandler selectedParcel={selectedParcel} />
                    <Polygon
                        positions={convertCoordinates(selectedParcel.geometry.rings)}
                        color="blue" weight={3}
                    >
                        <Popup autoOpen>
                            <strong>{selectedParcel.attributes.ownname}</strong><br />
                            Parcel ID: {selectedParcel.attributes.parno || selectedParcel.attributes.altparno}<br />
                            Acres: {numToTwoDecimals(selectedParcel.attributes.gisacres)}<br />
                            County: {selectedParcel.attributes.cntyname}<br />
                            <a href={countyGISMap[selectedParcel.attributes.cntyname]} target="_blank">County GIS</a>
                        </Popup>
                    </Polygon>
                </>
            )}

            {/* Display nearby parcels */}
            {nearbyParcels.map((parcel, index) => (
                parcel.geometry?.rings && (
                    <Polygon
                        key={index}
                        positions={convertCoordinates(parcel.geometry.rings)}
                        color="green" weight={0.5} fillOpacity={0.1}
                    >
                        <Popup>
                            <strong>{parcel.attributes.ownname}</strong><br />
                            Parcel ID: {parcel.attributes.parno || parcel.attributes.altparno}<br />
                            Acres: {numToTwoDecimals(parcel.attributes.gisacres)}<br />
                            County: {parcel.attributes.cntyname}<br />
                            <a href={countyGISMap[parcel.attributes.cntyname]} target="_blank">County GIS</a>
                        </Popup>
                    </Polygon>
                )
            ))}
        </MapContainer >
    );
};

export default ParcelMap;
