import {fetchGeoJson} from "./Explore.services";

export const loadMapConfig = async () => {
    try {
        const response = await fetch("/config/mapConfig.json");
        const config = await response.json();
        return config || {};
    } catch (error) {
        console.error("Error loading map configuration:", error);
        return {};
    }
};

export const loadGeoJsonLayers = async (layersConfig = []) => {
    try {
        const layersData = await Promise.all(
            layersConfig.map(async (layer) => ({
                ...layer,
                geojsonData: await fetchGeoJson(layer.url),
            }))
        );
        return layersData;
    } catch (error) {
        console.error("Error loading GeoJSON layers:", error);
        return [];
    }
};
