import {useEffect, useState} from "react";

export const handleSelectExisting = async (
    selectedConfig,
    onConfigSelected,
    onClose
) => {
    if (!selectedConfig) return;

    try {
        const response = await fetch(
            `/config/taxis_vis_config/${selectedConfig}/config.json`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch existing config JSON");
        }
        const loadedConfig = await response.json();

        onConfigSelected({
            type: "existing",
            configName: selectedConfig,
            config: loadedConfig,
        });

        onClose();
    } catch (err) {
        console.error("Error loading existing config:", err);
        alert("Error loading existing config. Check console for details.");
    }
};

export const handleCreateNew = async (
    newConfigName,
    dataFile,
    tileLayer,
    centerLat,
    centerLng,
    zoom,
    pickupLonCol,
    pickupLatCol,
    dropoffLonCol,
    dropoffLatCol,
    datetimePickup,
    datetimeDropoff,
    layers,
    onConfigSelected,
    onClose,
    threeDEnabled,
    requiredColumnsMapping,
    neighborhoodKeys
) => {
    if (!newConfigName || !dataFile) {
        alert("Please provide a config name and upload a CSV/Parquet/Arrow file.");
        return;
    }
    if (!tileLayer || !centerLat || !centerLng || !zoom) {
        alert("Please provide complete map settings (tile layer, center, zoom).");
        return;
    }

    if (!layers.some((l) => l.layerName === "neighborhood" && l.geoJsonFile)) {
        alert("You must provide a GeoJSON file for the neighborhood layer.");
        return;
    }

    const memoryLayers = await Promise.all(
        layers.map(async (layer, idx) => {
            let parsedGeojson = null;
            if (layer.geoJsonFile) {
                try {
                    const text = await readFileAsText(layer.geoJsonFile);
                    parsedGeojson = JSON.parse(text);
                } catch (err) {
                    console.error("Invalid GeoJSON file", err);
                }
            }
            return {
                id: `layer-${idx}`,
                name: layer.layerName || `Layer ${idx}`,
                style: {color: layer.color, weight: 2, opacity: 0.5},
                data: parsedGeojson,
            };
        })
    );

    const newConfigObj = {
        name: newConfigName,
        csvLocationCols: {
            pickupLon: pickupLonCol,
            pickupLat: pickupLatCol,
            dropoffLon: dropoffLonCol,
            dropoffLat: dropoffLatCol,
        },
        datetimeColumns: {pickup: datetimePickup, dropoff: datetimeDropoff},
        locationColumns: {pickup: "pickup", dropoff: "dropoff"},
        mapSettings: {
            tileLayer,
            threeDEnabled: threeDEnabled,
            center: [parseFloat(centerLng), parseFloat(centerLat)],
            zoom: parseFloat(zoom),
        },
        geoJsonLayers: memoryLayers,
        logical_db_to_required_columns: requiredColumnsMapping,
        neighborhoodKeys: neighborhoodKeys.filter((k) => k),
    };

    onConfigSelected({
        type: "new",
        configName: newConfigName.trim().replace(/\s+/g, "_"),
        config: newConfigObj,
        file: dataFile,
        layerFiles: layers.map((l) => l.geoJsonFile).filter(Boolean),
    });

    onClose();
};

export const readFileAsText = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });

export const useConfigService = () => {
    const [existingConfigs, setExistingConfigs] = useState([]);

    useEffect(() => {
        fetch("/config/taxis_vis_config/config_list.json")
            .then((res) => res.json())
            .then((data) => setExistingConfigs(data.configNames || []))
            .catch((err) => console.error(err));
    }, []);

    return {existingConfigs};
};

export const fetchTileLayers = async () => {
    const response = await fetch("/utils/tiles_layers.json");
    if (!response.ok) {
        throw new Error("Failed to fetch tile layers");
    }
    return await response.json();
};

export const fetchCityCenters = async () => {
    const response = await fetch("/utils/cities_centers.json");
    if (!response.ok) {
        throw new Error("Failed to fetch city centers");
    }
    return await response.json();
};

export const parseCsvFile = async (file, delimiter, customDelimiter) => {
    if (!file || !file.name.toLowerCase().endsWith(".csv")) {
        return [];
    }
    const text = await file.text();
    const firstLine = text.split(/\r?\n/)[0];

    let effectiveDelimiter = delimiter === "custom" ? customDelimiter : delimiter;
    if (!effectiveDelimiter) {
        const possibleDelimiters = [",", "|", ";", "\t"];
        effectiveDelimiter =
            possibleDelimiters.find((delim) => firstLine.includes(delim)) || ",";
    }
    const cols = firstLine.split(effectiveDelimiter);
    return cols.map((c) => c.trim());
};

export const addLayerToList = (prevLayers, getRandomColor) => {
    return [
        ...prevLayers,
        {layerName: "", geoJsonFile: null, color: getRandomColor()},
    ];
};

export const updateLayerInList = (layers, index, field, value) => {
    const updated = [...layers];
    updated[index][field] = value;
    return updated;
};

export const removeLayerFromList = (layers, index) => {
    if (index === 0) return layers;
    return layers.filter((_, i) => i !== index);
};

export const addKeyword = (newKeyword, neighborhoodKeys) => {
    const trimmed = newKeyword.trim();
    if (trimmed && !neighborhoodKeys.includes(trimmed)) {
        return [...neighborhoodKeys, trimmed];
    }
    return neighborhoodKeys;
};

export const removeKeyword = (keywordToRemove, neighborhoodKeys) => {
    return neighborhoodKeys.filter((keyword) => keyword !== keywordToRemove);
};
