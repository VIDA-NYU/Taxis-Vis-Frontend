import {API_URLS} from "../../config/apiUrls";

const flattenObject = (obj, parent = '', res = {}) => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const propName = parent ? `${parent}_${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                flattenObject(obj[key], propName, res);
            } else {
                res[propName] = obj[key];
            }
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

export const uploadTripsForAnalysis = async (analysis, filteredTrips) => {
    if (!analysis || !analysis.endpoint) {
        throw new Error("Invalid analysis or missing endpoint.");
    }

    const csvContent = convertTripsToCSV(filteredTrips);
    if (!csvContent) {
        throw new Error("No trips available for analysis.");
    }

    const blob = new Blob([csvContent], {type: "text/csv"});
    const formData = new FormData();
    formData.append("file", blob, "filtered_taxis.csv");

    if (analysis.additionalParams && typeof analysis.additionalParams === "object") {
        Object.entries(analysis.additionalParams).forEach(([key, value]) => {
            formData.append(key, value);
        });
    }

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
