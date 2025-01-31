import {API_URLS} from "../../config/apiUrls";

export const fetchTrips = async (queries, limit = 1000000) => {
    if (!queries || queries.length === 0) {
        return {markers: [], heatmapData: [], trips: []};
    }

    try {
        const response = await fetch(API_URLS.TRIPS.FETCH, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({queries, limit}),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();

        const markers = [];
        const heatmapData = [];
        const bounds = [];

        data.forEach((doc) => {
            if (!doc?.pickup?.coordinates || !doc?.dropoff?.coordinates) {
                console.warn("Missing coordinates in document:", doc);
                return;
            }
            const [pickupLng, pickupLat] = doc?.pickup?.coordinates;
            const [dropoffLng, dropoffLat] = doc?.dropoff?.coordinates;

            markers.push({position: [pickupLat, pickupLng], color: "blue"});
            markers.push({position: [dropoffLat, dropoffLng], color: "orange"});

            heatmapData.push([pickupLat, pickupLng]);
            heatmapData.push([dropoffLat, dropoffLng]);

            bounds.push([pickupLat, pickupLng], [dropoffLat, dropoffLng]);
        });

        return {markers, heatmapData, trips: data, bounds};
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};
