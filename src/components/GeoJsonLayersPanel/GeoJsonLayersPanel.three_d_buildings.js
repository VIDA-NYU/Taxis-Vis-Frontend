export const add3DBuildingsLayer = (map) => {
    if (!map) return;

    const insert3DBuildingsLayer = () => {
        if (map.getLayer("add-3d-buildings")) {
            return;
        }

        const layers = map.getStyle().layers;
        const labelLayerId = layers.find((l) => l.type === "symbol" && l.layout?.["text-field"])?.id;

        map.addLayer(
            {
                id: "add-3d-buildings",
                source: "composite",
                "source-layer": "building",
                filter: ["==", "extrude", "true"],
                type: "fill-extrusion",
                minzoom: 15,
                paint: {
                    "fill-extrusion-color": "#aaa",
                    "fill-extrusion-height": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        15,
                        0,
                        15.05,
                        ["get", "height"],
                    ],
                    "fill-extrusion-base": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        15,
                        0,
                        15.05,
                        ["get", "min_height"],
                    ],
                    "fill-extrusion-opacity": 0.6,
                },
            },
            labelLayerId
        );
    };

    if (map.isStyleLoaded()) {
        insert3DBuildingsLayer();
    } else {
        map.on("load", insert3DBuildingsLayer);
    }
};

export const toggle3DBuildingsVisibility = (map) => {
    if (!map.getLayer("add-3d-buildings")) {
        console.warn("3D Buildings layer is not yet loaded, cannot toggle visibility.");
        return;
    }
    const currentVisibility = map.getLayoutProperty("add-3d-buildings", "visibility");
    const newVisibility = currentVisibility === "visible" ? "none" : "visible";
    map.setLayoutProperty("add-3d-buildings", "visibility", newVisibility);
    return newVisibility === "visible";
};
