import * as turf from "@turf/turf";

export function getNeighborhoodNameKeys(config) {
    const defaultKeys = ["name", "neighborhood", "area_name", "zone"];

    if (config && config.neighborhoodKeys && Array.isArray(config.neighborhoodKeys)) {
        return [...new Set([...defaultKeys, ...config.neighborhoodKeys])];
    }

    return defaultKeys;
}

const extractPolygons = (geometry) => {
    if (!geometry || !geometry.type || !geometry.coordinates) return [];

    if (geometry.type === "Polygon") {
        return [turf.polygon(geometry.coordinates)];
    } else if (geometry.type === "MultiPolygon") {
        return geometry.coordinates.map((coords) => turf.polygon(coords));
    }

    return [];
};

export const findIntersectingNeighborhoods = (regionGeoJSON, geoJsonLayers, config) => {
    if (!regionGeoJSON || !regionGeoJSON.coordinates) return [];

    const queryPolygons = extractPolygons(regionGeoJSON);
    if (queryPolygons.length === 0) return [];

    const neighborhoodsGeoJson = getNeighborhoodsGeoJson(geoJsonLayers);

    return neighborhoodsGeoJson.features
        .filter((feature) => {
            const featurePolygons = extractPolygons(feature.geometry);
            return featurePolygons.some((neighborhoodPolygon) =>
                queryPolygons.some((queryPolygon) =>
                    turf.booleanIntersects(queryPolygon, neighborhoodPolygon)
                )
            );
        })
        .map((feature) => getNeighborhoodName(feature, config))
};

export const findNeighborhoodContainingPoint = (pointCoordinates, geoJsonLayers, config) => {
    if (!pointCoordinates || pointCoordinates.length !== 2) return "Unknown Neighborhood";

    const point = turf.point(pointCoordinates);
    const neighborhoodsGeoJson = getNeighborhoodsGeoJson(geoJsonLayers);

    const containingFeature = neighborhoodsGeoJson.features.find((feature) => {
        const featurePolygons = extractPolygons(feature.geometry);
        return featurePolygons.some((neighborhoodPolygon) =>
            turf.booleanPointInPolygon(point, neighborhoodPolygon)
        );
    });

    return containingFeature ? getNeighborhoodName(containingFeature, config) : "Unknown Neighborhood";
};

const getNeighborhoodName = (feature, config) => {
    const neighborhoodNameKeys = getNeighborhoodNameKeys(config);

    for (const key of neighborhoodNameKeys) {
        if (feature.properties && feature.properties[key]) {
            return feature.properties[key];
        }
    }
    return "Unnamed Neighborhood";
};

export const getNeighborhoodsGeoJson = (geoJsonLayers) => {
    if (!geoJsonLayers || geoJsonLayers.length === 0) {
        console.warn("No GeoJSON layers found!");
        return {type: "FeatureCollection", features: []};
    }

    const neighborhoodLayer = geoJsonLayers.find((layer) =>
        layer.name.toLowerCase().includes("neighborhood")
    );

    if (!neighborhoodLayer || !neighborhoodLayer.geojsonData) {
        console.warn("Neighborhood GeoJSON not found in layers!");
        return {type: "FeatureCollection", features: []};
    }

    return neighborhoodLayer.geojsonData;
};
