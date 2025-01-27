import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import {GeoJSON} from "react-leaflet";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import "./GeoJsonLayersPanel.styles.css";

const GeoJsonLayersPanel = ({layers, position = "top-right"}) => {
    const [visibility, setVisibility] = useState(
        layers.reduce((acc, layer) => {
            acc[layer.id] = true;
            return acc;
        }, {})
    );
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        const updatedVisibility = layers.reduce((acc, layer) => {
            acc[layer.id] = visibility[layer.id] ?? true;
            return acc;
        }, {});
        setVisibility(updatedVisibility);
    }, [layers]);

    const toggleVisibility = (id) => {
        setVisibility((prev) => ({...prev, [id]: !prev[id]}));
    };

    const toggleMinimized = () => {
        setIsMinimized((prev) => !prev);
    };

    return (
        <div
            className={`geo_json_layers-panel ${position} ${
                isMinimized ? "minimized" : ""
            }`}
        >
            <div
                className={`geo_json_layers-header ${
                    isMinimized ? "minimized" : ""
                }`}
            >
                <span>GeoJSON Layers</span>
                <Tooltip
                    title={isMinimized ? "Expand Legend" : "Minimize Legend"}
                    arrow
                >
                    <IconButton
                        className="geo_json_layers-minimize-btn small-btn"
                        onClick={toggleMinimized}
                        aria-label={isMinimized ? "Expand Legend" : "Minimize Legend"}
                        size="small"
                    >
                        {isMinimized ? <ExpandMore/> : <ExpandLess/>}
                    </IconButton>
                </Tooltip>
            </div>

            {!isMinimized && (
                <div className="geo_json_layers-list">
                    {layers.map((layer) => (
                        <div
                            key={layer.id}
                            className="geo_json_layers-item"
                            onClick={() => toggleVisibility(layer.id)}
                        >
                            <div
                                className="geo_json_layers-icon"
                                style={{backgroundColor: layer.style?.color || "#000"}}
                            />
                            <span className="geo_json_layers-name">{layer.name}</span>
                            <input
                                type="checkbox"
                                checked={visibility[layer.id]}
                                onChange={() => toggleVisibility(layer.id)}
                                className="geo_json_layers-checkbox"
                            />
                        </div>
                    ))}
                </div>
            )}

            {layers.map((layer) =>
                visibility[layer.id] && layer.geojsonData ? (
                    <GeoJSON
                        key={`${layer.id}-${JSON.stringify(layer.geojsonData).length}`}
                        data={layer.geojsonData}
                        style={layer.style || {color: "blue", weight: 2, opacity: 0.6}}
                    />
                ) : null
            )}
        </div>
    );
};

GeoJsonLayersPanel.propTypes = {
    layers: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            geojsonData: PropTypes.object,
            style: PropTypes.object,
        })
    ).isRequired,
    position: PropTypes.oneOf(["top-right", "top-left", "bottom-right", "bottom-left"]),
};

export default GeoJsonLayersPanel;
