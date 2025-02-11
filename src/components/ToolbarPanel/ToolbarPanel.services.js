import {runQuery} from "duckdb-wasm-kit";
import {maybeQuoteIdentifier} from "../../utils/helper";

const convertDuckDBTimestamp = (duckDbValue) => {
    if (duckDbValue === null || duckDbValue === undefined) {
        return null;
    }

    if (typeof duckDbValue === "number") {
        return new Date(duckDbValue).toISOString();
    }

    if (typeof duckDbValue === "object" && duckDbValue?.micros) {
        const milliseconds = Number(duckDbValue.micros / 1000n);
        return new Date(milliseconds).toISOString();
    }

    console.warn("Unexpected DuckDB timestamp format:", duckDbValue);
    return null;
};


export const fetchDateRange = async (db, config) => {
    try {
        if (!db) throw new Error("DuckDB instance is not initialized");

        const {pickup, dropoff} = config.datetimeColumns;
        const quotedTable = maybeQuoteIdentifier(config.tableName);
        const sql = `
            SELECT MIN(${pickup})  AS earliestPickup,
                   MAX(${dropoff}) AS latestDropoff
            FROM ${quotedTable}
        `;

        const arrowResult = await runQuery(db, sql);
        const rows = arrowResult.toArray().map((row) => row.toJSON());

        if (rows.length === 0 || !rows[0].earliestPickup || !rows[0].latestDropoff) {
            throw new Error("No rows or columns found for the table.");
        }

        return {
            start: convertDuckDBTimestamp(rows[0].earliestPickup),
            end: convertDuckDBTimestamp(rows[0].latestDropoff),
        };
    } catch (error) {
        console.error("Error fetching date range:", error);
        throw error;
    }
};
