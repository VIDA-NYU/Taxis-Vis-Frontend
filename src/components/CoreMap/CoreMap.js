import React from "react";
import PropTypes from "prop-types";
import {MapContainer, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./CoreMap.styles.css";
import L from "leaflet";
import "../../lib/SmoothWheelZoom";
import cities from "../../utils/cities_centers.json";
import tileLayerSources from "../../utils/tiles_layers.json";

const CoreMap = ({
                     center = [cities.nyc.lat, cities.nyc.lng],
                     zoom = 12,
                     children,
                     maxZoom = 18,
                     scrollWheelZoom = false,
                     smoothWheelZoom = true,
                     smoothSensitivity = 15,
                     className = "",
                     tileLayer = "osm",
                 }) => {
    const selectedTileLayer = tileLayerSources[tileLayer];

    if (!selectedTileLayer) {
        throw new Error(`Tile layer '${tileLayer}' is not defined in tileLayerSources.json`);
    }

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            zoomControl={false}
            className={`core_map-container ${className}`}
            maxZoom={maxZoom}
            touchZoom={true}
            renderer={L.canvas()}
            scrollWheelZoom={scrollWheelZoom}
            smoothWheelZoom={smoothWheelZoom}
            smoothSensitivity={smoothSensitivity}
        >
            <TileLayer
                attribution={selectedTileLayer.attribution}
                url={selectedTileLayer.url}
            />
            {children}
        </MapContainer>
    );
};

CoreMap.propTypes = {
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
    children: PropTypes.node,
    maxZoom: PropTypes.number,
    scrollWheelZoom: PropTypes.bool,
    smoothWheelZoom: PropTypes.bool,
    smoothSensitivity: PropTypes.number,
    className: PropTypes.string,
    tileLayer: PropTypes.oneOf(Object.keys(tileLayerSources)),
};

export default CoreMap;
