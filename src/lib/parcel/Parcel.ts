import { ParcelData } from "../../types/ParcelData";
import {
  isNumeric,
  numToTwoDecimals,
  removeLeadingZeros,
} from "./formatHelpers";

export class Parcel {
  constructor(public data: ParcelData) {
    if (!data.attributes) {
      throw new Error("Parcel data must have attributes.");
    }
  }
  get attributes() {
    return this.data.attributes;
  }
  get geometry() {
    return this.data.geometry;
  }
  get rings() {
    return this.geometry.rings;
  }
  get mainParcelNumber() {
    return this.attributes.parno.trim();
  }
  get alternateParcelNumber() {
    return this.attributes.altparno.trim();
  }
  get validParcelNumber() {
    return this.attributes.parno.trim() || this.attributes.altparno.trim();
  }
  get siteAddress() {
    return this.extractFullSiteAddress();
  }
  get siteAddressNumber() {
    return this.extractAddressNumber(this.siteAddress);
  }
  get county() {
    return this.attributes.cntyname.trim();
  }
  get ownerName() {
    return this.attributes.ownname.trim();
  }
  get deedRef() {
    return this.attributes.sourceref.trim();
  }
  get platRef() {
    return this.attributes.mapref.trim();
  }
  get acreage() {
    return this.attributes.gisacres > 0
      ? numToTwoDecimals(this.attributes.gisacres)
      : numToTwoDecimals(this.attributes.recareano);
  }
  private extractAddressNumber(address: string): string {
    const firstPart = address.split(" ")[0];
    return isNumeric(firstPart) ? firstPart : "0";
  }
  private extractFullSiteAddress(): string {
    const fullSiteAddress =
      this.attributes.siteadd ||
      `${this.attributes.saddpref} ${this.attributes.saddno} ${this.attributes.saddstr} ${this.attributes.saddsttyp} ${this.attributes.saddstsuf}`;
    return removeLeadingZeros(fullSiteAddress.trim());
  }
}
