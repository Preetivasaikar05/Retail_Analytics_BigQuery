// Shared business rules. Every model reads them from here, so a rule changes in ONE place.

// Guest checkouts (no customer id) point at this "Unknown" dimension member.
const UNKNOWN_CUSTOMER_KEY = -1;

// Stock codes that are fees, postage, samples or tests - not merchandise.
const NON_PRODUCT_CODES = [
    "POST", "DOT", "M", "D", "S", "BANK CHARGES", "ADJUST", "ADJUST2",
    "AMAZONFEE", "CRUK", "PADS", "B", "C2", "TEST001", "TEST002",
];
const NON_PRODUCT_PREFIXES = ["GIFT"]; // gift vouchers

// Inconsistent country spellings in the source -> standard names (keys are upper case).
const COUNTRY_MAP = {
    EIRE: "Ireland",
    RSA: "South Africa",
    USA: "United States",
    UNSPECIFIED: "Unknown",
};

const sqlList = (items) => items.map((i) => `'${i}'`).join(", ");

// SQL condition: TRUE when a stock code is not merchandise.
const nonProductCondition = (col = "stock_code") =>
    `(${col} IN (${sqlList(NON_PRODUCT_CODES)}) OR ` +
    NON_PRODUCT_PREFIXES.map((p) => `STARTS_WITH(${col}, '${p}')`).join(" OR ") + `)`;

// SQL expression: standardised country, 'Unknown' when empty.
const countryExpression = (col = "country") =>
    `COALESCE(CASE UPPER(TRIM(${col}))\n` +
    Object.entries(COUNTRY_MAP).map(([k, v]) => `    WHEN '${k}' THEN '${v}'`).join("\n") +
    `\n    ELSE NULLIF(TRIM(${col}), '') END, 'Unknown')`;

module.exports = {
    UNKNOWN_CUSTOMER_KEY,
    NON_PRODUCT_CODES,
    COUNTRY_MAP,
    nonProductCondition,
    countryExpression
};
