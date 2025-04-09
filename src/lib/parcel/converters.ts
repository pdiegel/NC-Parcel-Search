import { LatLngExpression } from "leaflet";
import proj4 from "proj4";
import { Ring } from "../../types/Ring";

export const convertCoordinates = (rings: Ring[]): LatLngExpression[] => {
  return rings.flatMap((ring) =>
    ring.map((coords) => {
      const [lon, lat] = proj4("EPSG:102719", "EPSG:4326", coords);
      return [lat, lon] as LatLngExpression;
    })
  );
};
