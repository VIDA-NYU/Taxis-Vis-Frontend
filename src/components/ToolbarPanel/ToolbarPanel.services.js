import {API_URLS} from "../../config/apiUrls";

export async function fetchAvailableDateRange() {
    try {
        const response = await fetch(API_URLS.TRIPS.DATE_RANGE);
        if (!response.ok) {
            throw new Error(`Failed to fetch date range: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching date range:", error);
        return null;
    }
}
