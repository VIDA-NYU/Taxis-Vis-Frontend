import {API_URLS} from "../../config/apiUrls";

export const fetchTrips = async (queries, limit = 1000000) => {
    if (!queries || queries.length === 0) {
        return {
            markers: [],
            pickupHeatmapData: [],
            dropoffHeatmapData: [],
            trips: [],
            bounds: [],
        };
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
        const pickupHeatmapData = [];
        const dropoffHeatmapData = [];
        const bounds = [];

        data.forEach((doc) => {
            if (!doc?.pickup?.coordinates || !doc?.dropoff?.coordinates) {
                console.warn("Missing coordinates in document:", doc);
                return;
            }
            const [pickupLng, pickupLat] = doc.pickup.coordinates;
            const [dropoffLng, dropoffLat] = doc.dropoff.coordinates;

            markers.push({position: [pickupLat, pickupLng], type: "pickup"});
            markers.push({position: [dropoffLat, dropoffLng], type: "dropoff"});

            pickupHeatmapData.push([pickupLat, pickupLng]);
            dropoffHeatmapData.push([dropoffLat, dropoffLng]);

            bounds.push([pickupLat, pickupLng], [dropoffLat, dropoffLng]);
        });

        return {
            markers,
            pickupHeatmapData,
            dropoffHeatmapData,
            trips: data,
            bounds,
        };
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};
