function numToTwoDecimals(number) {
    return (Math.round(number * 100) / 100).toFixed(2);
}

export default numToTwoDecimals;