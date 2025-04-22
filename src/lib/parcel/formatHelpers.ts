import { STREET_TYPES } from "../constants";

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
  //   console.log("value:", value);
  //   console.log("type:", type);
  //   console.log("field:", field);
  let whereClause = "";
  switch (type) {
    case "esriFieldTypeDouble":
      whereClause = `${field} = ${value}`; // Direct numeric match (without quotes)
      break;
    case "esriFieldTypeString":
      // Using a workaround due to inconsistent API data
      whereClause = `UPPER(${field}) LIKE UPPER('%${value}%') OR UPPER(${field}) LIKE UPPER('%${normalizeClaytonSiteAddress(
        value
      )}%')`;
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

export function replaceStringPlaceholders(
  template: string,
  replacements: Record<string, any>
): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return replacements[key] || match;
  });
}

export function removeLeadingZeros(str: string): string {
  while (str.length > 1 && str.startsWith("0")) {
    str = str.substring(1);
  }
  return str;
}

export function normalizeClaytonSiteAddress(address: string): string {
  // in the API data, Town of Clayton has a unique site address spacing that needs to be normalized.
  // i.e. "356 lassiter farms ln" should format to "356  LASSITER FARMS   LN"
  address = address.toUpperCase().trim();
  const addressParts = address.split(" ");
  let normalizedAddress = "";

  addressParts.forEach((part, index) => {
    if (index === 0) {
      normalizedAddress += part;
      if (isNumeric(part)) {
        // add an extra space if the first part is a number
        normalizedAddress += " ";
      }
      return;
    }

    if (STREET_TYPES.has(part)) {
      normalizedAddress += `   ${part}`;
      return;
    }

    normalizedAddress += ` ${part}`;
  });

  return normalizedAddress;
}
