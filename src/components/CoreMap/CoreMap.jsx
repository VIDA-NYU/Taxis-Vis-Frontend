import React, {useRef, useEffect, useState} from "react";
import PropTypes from "prop-types";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "./CoreMap.styles.css";
import {DirectionalMode, DropoffMode, PickupMode} from "./CoreMap.utils.modes";
import {drawStyles} from "./CoreMap.utils.styles";
import tileLayers from "../../../public/utils/tiles_layers.json";
import citiesCenters from "../../../public/utils/cities_centers.json";

const CoreMap = ({
                   center = [-74.0060, 40.7128],
                   zoom = 12,
                   children,
                   tileLayer
                 }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const drawRef = useRef(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const resolveCenter = (centerProp) => {
    if (Array.isArray(centerProp)) {
      return centerProp;
    }
    if (typeof centerProp === "string") {
      const city = citiesCenters[centerProp.toLowerCase()];
      if (city) {
        return [city.lng, city.lat];
      }
    }
    return [-74.0060, 40.7128];
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

    let styleUrl;
    if (tileLayer && tileLayers[tileLayer]) {
      styleUrl = tileLayers[tileLayer].styleUrl;
    } else if (tileLayer) {
      styleUrl = tileLayer;
    } else {
      styleUrl = tileLayers["streets-v12-2D"].styleUrl;
    }

    const mapCenter = resolveCenter(center);

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: mapCenter,
      zoom
    });

    mapRef.current.on("load", () => {
      setIsMapLoaded(true);
    });

    drawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      userProperties: true,
      styles: drawStyles,
      modes: {
        ...MapboxDraw.modes,
        pickup_mode: PickupMode,
        dropoff_mode: DropoffMode,
        directional_mode: DirectionalMode
      }
    });

    mapRef.current.addControl(drawRef.current, "top-left");

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [center, zoom, tileLayer]);

  const enhancedChildren = isMapLoaded
      ? React.Children.map(children, (child) =>
        child
            ? React.cloneElement(child, {
              map: mapRef.current,
              draw: drawRef.current
            })
            : null
      )
      : null;

  return (
      <div className="core_map-wrapper" style={{height: "100%", width: "100%"}}>
        <div ref={mapContainerRef} className="core_map-container"/>
        {enhancedChildren}
      </div>
  );
};

CoreMap.propTypes = {
  center: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.string
  ]),
  zoom: PropTypes.number,
  children: PropTypes.node,
  tileLayer: PropTypes.string
};

export default CoreMap;
