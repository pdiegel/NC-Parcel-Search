export function numToTwoDecimals(number) {
    return (Math.round(number * 100) / 100).toFixed(2);
}

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function formatWhereClause(value, field) {
    if (isNumeric(value)) {
        console.log(`Formatted to ${field} = ${value}`);
        return `${field} = ${value}`; // Direct numeric match (without quotes)
    }
    console.log(`Formatted to UPPER(${field}) LIKE UPPER('%${value}%')`);
    return `UPPER(${field}) LIKE UPPER('%${value}%')`; // Wildcards for string fields
}
