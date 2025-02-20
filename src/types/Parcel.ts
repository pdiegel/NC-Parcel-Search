import { Ring } from "./Ring";

export type Parcel = {
  attributes: { [key: string]: any };
  geometry: { rings: Ring[] };
};
