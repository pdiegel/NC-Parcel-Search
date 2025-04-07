import { Parcel } from "../../types/Parcel";

export function numToTwoDecimals(number: number) {
  return (Math.round(number * 100) / 100).toFixed(2);
}

export function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function formatWhereClause(value: string, type: string, field: string) {
  if (!value) {
    return "1=1"; // Return all records
  }
  console.log("value:", value);
  console.log("type:", type);
  console.log("field:", field);
  let whereClause = "";
  switch (type) {
    case "esriFieldTypeDouble":
      whereClause = `${field} = ${value}`; // Direct numeric match (without quotes)
      break;
    case "esriFieldTypeString":
      whereClause = `UPPER(${field}) LIKE UPPER('%${value}%')`;
      break;
    case "esriFieldTypeDate":
      whereClause = `${field} = '${value}'`;
      break;
    case "esriFieldTypeInteger":
      whereClause = `${field} = ${value}`;
      break;
    case "esriFieldTypeGeometry":
      whereClause = `${field} = ${value}`;
      break;
    default:
      whereClause = `${field} = '${value}'`; // Default to string match
  }

  switch (field) {
    /* Parcel numbers have two possible fields: parno and altparno
    If the user searches for a parcel number, we need to check both fields */
    case "parno":
      whereClause = `UPPER(${field}) LIKE UPPER('%${value}%') OR UPPER(altparno) LIKE UPPER('%${value}%')`;
      break;
    default:
      break;
  }
  console.log("Where Clause: ", whereClause);
  return whereClause;
}

export function extractAddressNumber(address: string): string {
  const addressParts = address.split(" ");
  if (addressParts[0] && isNumeric(addressParts[0])) {
    return addressParts[0];
  }
  return "0";
}

export function extractFullSiteAddress(parcel: Parcel): string {
  return (
    parcel.attributes.siteadd ||
    `${parcel.attributes.saddpref} \
    ${parcel.attributes.saddno} ${parcel.attributes.saddstr} \
    ${parcel.attributes.saddsttyp} ${parcel.attributes.saddstsuf}`
  );
}

export function replaceStringPlaceholders(
  template: string,
  replacements: Record<string, any>
): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return replacements[key] || match;
  });
}
