import {API_URLS} from "../../config/apiUrls";

const flattenObject = (obj, parent = '', res = {}) => {
    for (let key in obj) {
        if (!obj.hasOwnProperty(key)) continue;

        const propName = parent ? `${parent}_${key}` : key;

        if (['pickup', 'dropoff'].includes(key) && typeof obj[key] === 'object') {
            res[propName] = JSON.stringify(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            flattenObject(obj[key], propName, res);
        } else {
            res[propName] = obj[key];
        }
    }
    return res;
};

export const escapeForCSV = (value) => {
    if (value == null) {
        return '';
    }
    const stringValue = String(value);
    return `"${stringValue.replace(/"/g, '""')}"`;
};

export const convertTripsToCSV = (trips = []) => {
    if (!Array.isArray(trips) || trips.length === 0) {
        return '';
    }

    const flattenedTrips = trips.map(trip => flattenObject(trip));

    const headersSet = new Set();
    flattenedTrips.forEach(trip => {
        Object.keys(trip).forEach(key => headersSet.add(key));
    });
    const headers = Array.from(headersSet);

    const csvHeaders = headers.join(',');

    const rows = flattenedTrips.map(trip => {
        return headers.map(header => escapeForCSV(trip[header])).join(',');
    });

    return `${csvHeaders}\n${rows.join('\n')}`;
};

export const checkAvailableAnalyses = (filteredTrips, requiredColumns) => {
    if (!filteredTrips || filteredTrips.length === 0) return {};

    const datasetColumns = new Set(Object.keys(filteredTrips[0] || {}));

    return Object.fromEntries(
        requiredColumns.map(column => [column, datasetColumns.has(column)])
    );
};

export const filterValidTrips = (filteredTrips, requiredColumns) => {
    return filteredTrips.filter(trip => {
        let isValid = true;

        requiredColumns.forEach(column => {
            if (
                !trip.hasOwnProperty(column) ||
                trip[column] === null ||
                trip[column] === undefined ||
                (typeof trip[column] === "string" && trip[column].trim() === "")
            ) {
                console.warn(`Missing required column: ${column}`);
                console.warn(trip);
                isValid = false;
            }
        });

        return isValid;
    });
};

export const uploadTripsForAnalysis = async (analysis, filteredTrips, config) => {
    if (!analysis || !analysis.endpoint) {
        throw new Error("Invalid analysis or missing endpoint.");
    }

    const requiredColumns = analysis.requiredColumns || [];

    const validTrips = filterValidTrips(filteredTrips, requiredColumns);

    if (validTrips.length === 0) {
        throw new Error("No valid trips available for analysis.");
    }

    const csvContent = convertTripsToCSV(validTrips);
    if (!csvContent) {
        throw new Error("Failed to generate CSV.");
    }

    const blob = new Blob([csvContent], {type: "text/csv"});
    const formData = new FormData();
    formData.append("file", blob, "filtered_taxis.csv");

    let response;
    try {
        response = await fetch(`${API_URLS.VISUALIZATION}/${analysis.endpoint}/`, {
            method: "POST",
            body: formData,
        });
    } catch (networkError) {
        throw new Error(`Network error: ${networkError.message}`);
    }

    if (!response.ok) {
        let errorText;
        try {
            const errorData = await response.json();
            errorText = errorData.error || "Failed to fetch analysis data";
        } catch {
            errorText = response.statusText || "Failed to fetch analysis data";
        }
        throw new Error(errorText);
    }

    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error("Failed to parse server response");
    }

    return data;
};
