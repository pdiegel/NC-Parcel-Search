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
  console.log("Where Clause: ", whereClause);
  return whereClause;
}
