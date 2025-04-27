import { ParcelData } from "../../types/ParcelData";
import {
  isNumeric,
  numToTwoDecimals,
  removeLeadingZeros,
} from "./formatHelpers";

const DEED_REF_VARIATIONS = ["Deed Book-Page", "Deed Book/Page"];
const PLAT_REF_VARIATIONS = ["Plat Book-Page", "Plat Book/Page"];
const DEED_DELIMITER_VARIATIONS = ["/", "-"];
const PLAT_DELIMITER_VARIATIONS = ["/", "-"];

export class Parcel {
  constructor(public data: ParcelData) {
    if (!data.attributes) {
      throw new Error("Parcel data must have attributes.");
    }
    this.#convertAttributesToTitleCase();
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
    const altparno = this.attributes.altparno.trim();
    if (altparno.length < 4) return null;
    return altparno;
  }
  get validParcelNumber() {
    return this.attributes.parno.trim() || this.attributes.altparno.trim();
  }
  get siteAddress() {
    return this.#extractFullSiteAddress() || "No Address Found";
  }
  get siteAddressNumber() {
    return this.#extractAddressNumber(this.siteAddress);
  }
  get county() {
    return this.attributes.cntyname.trim();
  }
  get ownerName() {
    return this.attributes.ownname.trim();
  }
  get deedRef() {
    DEED_REF_VARIATIONS.forEach((deedRefVariation) => {
      if (this.attributes.sourceref.includes(deedRefVariation)) {
        this.attributes.sourceref = this.attributes.sourceref.replace(
          deedRefVariation,
          ""
        );
      }
    });
    DEED_DELIMITER_VARIATIONS.forEach((deedDelimiter) => {
      if (this.attributes.sourceref.includes(deedDelimiter)) {
        this.attributes.sourceref = this.attributes.sourceref.replace(
          deedDelimiter,
          "/"
        );
      }
    });
    return this.attributes.sourceref.trim();
  }
  get deedBook() {
    if (!this.deedRef.includes("/")) {
      return removeLeadingZeros(this.deedRef.trim());
    }
    return removeLeadingZeros(this.deedRef.split("/")[0].trim());
  }
  get deedPage() {
    if (!this.deedRef.includes("/")) {
      return "";
    }
    return removeLeadingZeros(this.deedRef.split("/")[1].trim());
  }
  get platRef() {
    PLAT_REF_VARIATIONS.forEach((platRefVariation) => {
      if (this.attributes.mapref.includes(platRefVariation)) {
        this.attributes.mapref = this.attributes.mapref.replace(
          platRefVariation,
          ""
        );
      }
    });
    PLAT_DELIMITER_VARIATIONS.forEach((platDelimiter) => {
      if (this.attributes.mapref.includes(platDelimiter)) {
        this.attributes.mapref = this.attributes.mapref.replace(
          platDelimiter,
          "/"
        );
      }
    });
    return this.attributes.mapref.trim();
  }
  get platBook() {
    if (!this.platRef.includes("/")) {
      return removeLeadingZeros(this.platRef.trim());
    }
    return removeLeadingZeros(this.platRef.split("/")[0].trim());
  }
  get platPage() {
    if (!this.platRef.includes("/")) {
      return "";
    }
    return removeLeadingZeros(this.platRef.split("/")[1].trim());
  }
  get acreage() {
    return this.attributes.gisacres > 0
      ? numToTwoDecimals(this.attributes.gisacres)
      : numToTwoDecimals(this.attributes.recareano);
  }
  #extractAddressNumber(address: string): string {
    const firstPart = address.split(" ")[0];
    return isNumeric(firstPart) ? firstPart : "0";
  }
  #extractFullSiteAddress(): string {
    const fullSiteAddress =
      this.attributes.siteadd ||
      `${this.attributes.saddpref} ${this.attributes.saddno} ${this.attributes.saddstr} ${this.attributes.saddsttyp} ${this.attributes.saddstsuf}`;
    return removeLeadingZeros(fullSiteAddress.trim());
  }
  #convertAttributesToTitleCase(): void {
    for (const key in this.attributes) {
      const value = this.attributes[key];
      if (typeof value !== "string") {
        continue;
      }
      this.attributes[key] = this.#toTitleCase(value);
    }
  }
  public shouldShowAlternateParcelNumber(): boolean {
    return (
      this.validParcelNumber === this.mainParcelNumber &&
      !!this.alternateParcelNumber
    );
  }
  #toTitleCase(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
