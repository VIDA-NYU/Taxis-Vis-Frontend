import {useState, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import mapboxgl from "mapbox-gl";
import {fetchTrips} from "./TaxisVisGeoSpatialManager.services";
import {
    createDropoffMarkerEl,
    createPickupMarkerEl,
    dropoffHeatmapPaint,
    pickupHeatmapPaint
} from "./TaxisVisGeoSpatialManager.utils";

const TaxisVisGeoSpatialManager = ({
                                       queries,
                                       onFilteredTrips,
                                       limit = 100000,
                                       map,
                                   }) => {
    const [markersData, setMarkersData] = useState([]);
    const [pickupHeatmapData, setPickupHeatmapData] = useState([]);
    const [dropoffHeatmapData, setDropoffHeatmapData] = useState([]);
    const markersRef = useRef([]);

    const pickupHeatLayerId = "pickup-heatmap-layer";
    const dropoffHeatLayerId = "dropoff-heatmap-layer";
    const pickupSourceId = "pickup-heatmap-source";
    const dropoffSourceId = "dropoff-heatmap-source";
    const THRESHOLD = 1000;

    const addMarkers = (markers) => {
        clearMarkers();
        markers.forEach((m) => {
            let el;
            if (m.type === "pickup") {
                el = createPickupMarkerEl();
            } else {
                el = createDropoffMarkerEl();
            }

            const pos = [m.position[1], m.position[0]];

            const marker = new mapboxgl.Marker(el, {anchor: "center"})
                .setLngLat(pos)
                .addTo(map);

            markersRef.current.push(marker);
        });
    };

    const addOrUpdateHeatmapLayer = (
        featuresData,
        sourceId,
        layerId,
        paintOverrides
    ) => {
        if (!map) return;

        const geojson = {
            type: "FeatureCollection",
            features: featuresData.map((coord) => ({
                type: "Feature",
                geometry: {type: "Point", coordinates: [coord[1], coord[0]]},
            })),
        };

        if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
                type: "geojson",
                data: geojson,
            });
        } else {
            map.getSource(sourceId).setData(geojson);
        }

        if (!map.getLayer(layerId)) {
            map.addLayer({
                id: layerId,
                type: "heatmap",
                source: sourceId,
                maxzoom: 15,
                paint: {
                    "heatmap-weight": [
                        "interpolate", ["linear"], ["zoom"], 0, 0.6, 15, 1,
                    ],
                    "heatmap-intensity": [
                        "interpolate", ["linear"], ["zoom"], 0, 1, 15, 3,
                    ],
                    "heatmap-radius": [
                        "interpolate", ["linear"], ["zoom"], 0, 2, 10, 15, 15, 25,
                    ],
                    "heatmap-opacity": [
                        "interpolate", ["linear"], ["zoom"], 10, 0.8, 15, 0.8,
                    ],
                    ...paintOverrides,
                },
            });
        } else {
            map.setLayoutProperty(layerId, "visibility", "visible");
        }
    };

    const clearMarkers = () => {
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];
    };

    const clearHeatMapLayer = (layerId, sourceId) => {
        if (!map) return;
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
        if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }
    };


    const removeAllHeatmaps = () => {
        clearHeatMapLayer(pickupHeatLayerId, pickupSourceId);
        clearHeatMapLayer(dropoffHeatLayerId, dropoffSourceId);
    };

    useEffect(() => {
        if (!queries || queries.length === 0) {
            clearMarkers();
            removeAllHeatmaps();
            return;
        }
        ;

        const fetchData = async () => {
            try {
                const {
                    markers,
                    pickupHeatmapData,
                    dropoffHeatmapData,
                    trips,
                    bounds,
                } = await fetchTrips(queries, limit);

                setMarkersData(markers);

                setPickupHeatmapData(pickupHeatmapData);
                setDropoffHeatmapData(dropoffHeatmapData);

                onFilteredTrips(trips);
            } catch (error) {
                console.error("Error fetching trips:", error);
            }
        };

        fetchData();
    }, [queries, limit, onFilteredTrips, map]);

    useEffect(() => {
        if (!map) return;

        if (
            markersData.length > 0 &&
            markersData.length < THRESHOLD
        ) {
            removeAllHeatmaps();
            addMarkers(markersData);
        } else {
            clearMarkers();
            addOrUpdateHeatmapLayer(
                pickupHeatmapData,
                pickupSourceId,
                pickupHeatLayerId,
                pickupHeatmapPaint
            );
            addOrUpdateHeatmapLayer(
                dropoffHeatmapData,
                dropoffSourceId,
                dropoffHeatLayerId,
                dropoffHeatmapPaint
            );
        }
    }, [
        markersData,
        pickupHeatmapData,
        dropoffHeatmapData,
        map,
        THRESHOLD,
    ]);

    return null;
};

TaxisVisGeoSpatialManager.propTypes = {
    queries: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string.isRequired,
            pickupRegion: PropTypes.object,
            dropoffRegion: PropTypes.object,
            lineCoordinates: PropTypes.array,
            buffer: PropTypes.number,
            fromDate: PropTypes.string,
            toDate: PropTypes.string,
        })
    ).isRequired,
    onFilteredTrips: PropTypes.func.isRequired,
    limit: PropTypes.number,
    map: PropTypes.object,
};

export default TaxisVisGeoSpatialManager;
