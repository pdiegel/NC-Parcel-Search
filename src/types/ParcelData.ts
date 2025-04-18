import { Ring } from "./Ring";

export type ParcelData = {
  attributes: { [key: string]: any };
  geometry: { rings: Ring[] };
};
