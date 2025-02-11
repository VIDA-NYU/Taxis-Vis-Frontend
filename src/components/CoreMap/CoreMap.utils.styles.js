const drawStyles = [
    {
        "id": "gl-draw-point",
        "type": "circle",
        "filter": ["all", ["==", "$type", "Point"], ["!=", "meta", "midpoint"]],
        "paint": {
            "circle-radius": 5,
            "circle-color": "#D20C0C"
        }
    },
    {
        "id": "gl-draw-polygon-fill",
        "type": "fill",
        "filter": ["all", ["==", "$type", "Polygon"], ["==", "active", "false"]],
        "paint": {
            "fill-color": [
                "case",
                ["==", ["get", "user_mode"], "pickup"], "blue",
                ["==", ["get", "user_mode"], "dropoff"], "red",
                ["==", ["get", "user_mode"], "directional"], "green",
                "#D20C0C"
            ],
            "fill-opacity": 0.1
        }
    },
    {
        "id": "gl-draw-polygon-stroke-inactive",
        "type": "line",
        "filter": ["all", ["==", "$type", "Polygon"], ["==", "active", "false"]],
        "layout": {
            "line-cap": "round",
            "line-join": "round"
        },
        "paint": {
            "line-color": [
                "case",
                ["==", ["get", "user_mode"], "pickup"], "blue",
                ["==", ["get", "user_mode"], "dropoff"], "red",
                ["==", ["get", "user_mode"], "directional"], "green",
                "#D20C0C"
            ],
            "line-width": 2
        }
    },
    {
        "id": "gl-draw-polygon-stroke-active",
        "type": "line",
        "filter": ["all", ["==", "$type", "Polygon"], ["==", "active", "true"]],
        "layout": {
            "line-cap": "round",
            "line-join": "round"
        },
        "paint": {
            "line-color": [
                "case",
                ["==", ["get", "user_mode"], "pickup"], "blue",
                ["==", ["get", "user_mode"], "dropoff"], "red",
                ["==", ["get", "user_mode"], "directional"], "green",
                "#D20C0C"
            ],
            "line-dasharray": ["literal", [0.2, 2]],
            "line-width": 2
        }
    },
    {
        "id": "gl-draw-line-inactive",
        "type": "line",
        "filter": ["all", ["==", "$type", "LineString"], ["==", "active", "false"]],
        "layout": {
            "line-cap": "round",
            "line-join": "round"
        },
        "paint": {
            "line-color": [
                "case",
                ["==", ["get", "user_mode"], "directional"], "green",
                "#D20C0C"
            ],
            "line-width": 2
        }
    },
    {
        "id": "gl-draw-line-active",
        "type": "line",
        "filter": ["all", ["==", "$type", "LineString"], ["==", "active", "true"]],
        "layout": {
            "line-cap": "round",
            "line-join": "round"
        },
        "paint": {
            "line-color": [
                "case",
                ["==", ["get", "user_mode"], "directional"], "green",
                "#D20C0C"
            ],
            "line-dasharray": ["literal", [0.2, 2]],
            "line-width": 2
        }
    },
    {
        "id": "gl-draw-vertex",
        "type": "circle",
        "filter": ["all", ["==", "$type", "Point"], ["==", "meta", "vertex"]],
        "paint": {
            "circle-radius": 4,
            "circle-color": "#FFF",
            "circle-stroke-color": "#D20C0C",
            "circle-stroke-width": 2
        }
    }
];

export {drawStyles};
