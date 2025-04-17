import axios from "axios";
import { formatWhereClause } from "../lib/parcel/formatHelpers";
import { Parcel } from "../types/Parcel";
import { Field } from "../types/Field";
import { BASE_URL, METADATA_URL, PARCEL_OUTFIELDS } from "../lib/constants";

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
        outFields: PARCEL_OUTFIELDS,
        returnGeometry: true,
        resultRecordCount: 100,
      },
    });
    if (response.data.error) {
      throw new Error(response.data.error.message);
    }
    console.log("Search Results:", response.data.features);
    return response.data.features || [];
  } catch (error) {
    console.error("API request failed:", error);
    return error.message;
  }
};

export const getFieldData = async (): Promise<Field[]> => {
  try {
    const response = await axios.get(METADATA_URL, {
      params: {
        f: "json",
        where: "1=1",
        returnGeometry: false,
      },
    });
    if (response.data.error) {
      throw new Error(response.data.error.message);
    }
    console.log("FIELDS", response.data.fields);
    return response.data.fields || [];
  } catch (error) {
    console.error("API request failed:", error);
    return [];
  }
};

export const getNearbyParcels = async (
  selectedParcel: Parcel,
  bufferFeet: number = 1000
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
        outFields: PARCEL_OUTFIELDS,
        returnGeometry: true,
        resultRecordCount: 1000,
      },
    });

    if (response.data.error) {
      throw new Error(response.data.error.message);
    }
    console.log("Nearby Parcels:", response.data.features);

    let parcels = response.data.features || [];

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
