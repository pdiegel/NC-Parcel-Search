import axios from "axios";
import { formatWhereClause } from "../helpers/formatHelpers";

const BASE_URL = "https://services.nconemap.gov/secure/rest/services/NC1Map_Parcels/MapServer/1/query";

// Function to search parcels by owner name or parcel number
export const searchParcels = async (query, field = "ownname") => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                f: "json",
                where: formatWhereClause(query, field),
                outFields: "*",
                returnGeometry: true,
            }
        });
        console.log(response.data.features);
        return response.data.features || [];
    } catch (error) {
        console.error("API request failed:", error);
        return [];
    }
};

// Function to fetch nearby parcels
export const getNearbyParcels = async (selectedParcel, bufferFeet = 2500) => {
    if (!selectedParcel || !selectedParcel.geometry || !selectedParcel.geometry.rings) {
        return [];
    }

    let allCoords = selectedParcel.geometry.rings.flat(); // Flatten all points
    let minX = Math.min(...allCoords.map(coord => coord[0]));
    let minY = Math.min(...allCoords.map(coord => coord[1]));
    let maxX = Math.max(...allCoords.map(coord => coord[0]));
    let maxY = Math.max(...allCoords.map(coord => coord[1]));

    minX -= bufferFeet;
    minY -= bufferFeet;
    maxX += bufferFeet;
    maxY += bufferFeet;

    const geometry = {
        xmin: minX,
        ymin: minY,
        xmax: maxX,
        ymax: maxY
    };

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                f: "json",
                geometry: JSON.stringify(geometry),
                geometryType: "esriGeometryEnvelope",
                spatialRel: "esriSpatialRelIntersects",
                outFields: "*",
                returnGeometry: true
            }
        });

        let parcels = response.data.features || [];

        // 🔥 Filter out the selected parcel
        parcels = parcels.filter(parcel => parcel.attributes.objectid !== selectedParcel.attributes.objectid);

        return parcels;
    } catch (error) {
        console.error("Error fetching nearby parcels:", error);
        return [];
    }
};