import axios from "axios";
import { formatWhereClause } from "../helpers/formatHelpers";
import { Parcel } from "../types/Parcel";
import { Field } from "../types/Field";

const BASE_URL: string =
  "https://services.nconemap.gov/secure/rest/services/NC1Map_Parcels/MapServer/1/query";
const METADATA_URL: string =
  "https://services.nconemap.gov/secure/rest/services/NC1Map_Parcels/MapServer/1?f=json";

// Function to search parcels by owner name or parcel number
export const searchParcels = async (
  query: string,
  type: string,
  field: string = "ownname"
): Promise<[]> => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        f: "json",
        where: formatWhereClause(query, type, field),
        outFields: "*",
        returnGeometry: true,
        resultRecordCount: 100,
      },
    });
    console.log(response.data.features);
    return response.data.features || [];
  } catch (error) {
    console.error("API request failed:", error);
    return [];
  }
};

export const getFieldData = async (): Promise<Field[]> => {
  try {
    const response = await axios.get(METADATA_URL, {
      params: {
        f: "json",
        where: "1=1",
        outFields: "*",
        returnGeometry: false,
      },
    });
    // console.log(response.data.fields);
    return response.data.fields || [];
  } catch (error) {
    console.error("API request failed:", error);
    return [];
  }
};

// Function to fetch nearby parcels
export const getNearbyParcels = async (
  selectedParcel: Parcel,
  bufferFeet: number = 500
) => {
  if (
    !selectedParcel ||
    !selectedParcel.geometry ||
    !selectedParcel.geometry.rings
  ) {
    return [];
  }
  console.log("Selected Parcel: ", selectedParcel);

  let allCoords = selectedParcel.geometry.rings.flat(); // Flatten all points
  let minX = Math.min(...allCoords.map((coord) => coord[0]));
  let minY = Math.min(...allCoords.map((coord) => coord[1]));
  let maxX = Math.max(...allCoords.map((coord) => coord[0]));
  let maxY = Math.max(...allCoords.map((coord) => coord[1]));

  minX -= bufferFeet;
  minY -= bufferFeet;
  maxX += bufferFeet;
  maxY += bufferFeet;

  const geometry = {
    xmin: minX,
    ymin: minY,
    xmax: maxX,
    ymax: maxY,
  };

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        f: "json",
        geometry: JSON.stringify(geometry),
        geometryType: "esriGeometryEnvelope",
        spatialRel: "esriSpatialRelIntersects",
        outFields: "*",
        returnGeometry: true,
        resultRecordCount: 400,
      },
    });

    let parcels = response.data.features || [];

    // 🔥 Filter out the selected parcel
    parcels = parcels.filter(
      (parcel) =>
        parcel.attributes.objectid !== selectedParcel.attributes.objectid
    );

    return parcels;
  } catch (error) {
    console.error("Error fetching nearby parcels:", error);
    return [];
  }
};
