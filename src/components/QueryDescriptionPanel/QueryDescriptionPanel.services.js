import {API_URLS} from "../../config/apiUrls";

export const fetchDescriptions = async (queries, limit = 100000) => {
    if (!queries || queries.length === 0) return [];

    try {
        const response = await fetch(API_URLS.NEIGHBORHOODS.DESCRIBE, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({queries, limit: limit}),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch descriptions: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching descriptions:", error);
        return [];
    }
};
