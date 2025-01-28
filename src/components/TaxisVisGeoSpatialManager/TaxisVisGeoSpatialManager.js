import React, {useState, useRef} from "react";
import PropTypes from "prop-types";
import {FeatureGroup, useMap, CircleMarker} from "react-leaflet";
import HeatmapLayer from "react-leaflet-heat-layer";
import useDeepCompareEffect from "./TaxisVisGeoSpatialManager.useDeepCompareEffect";
import {fetchTrips} from "./TaxisVisGeoSpatialManager.services";

const TaxisVisGeoSpatialManager = ({
                                       queries,
                                       onFilteredTrips,
                                       limit = 100000,
                                       markerStyle = {radius: 4},
                                       heatmapOptions = {
                                           radius: 20,
                                           blur: 15,
                                           max: 1.0,
                                           gradient: {
                                               0.4: "orange",
                                               0.65: "yellow",
                                               1: "red",
                                           },
                                       },
                                       markerColors = {pickup: "blue", dropoff: "orange"},
                                   }) => {
    const [markers, setMarkers] = useState([]);
    const [heatmapData, setHeatmapData] = useState([]);
    const map = useMap();
    const isMounted = useRef(false);

    React.useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleFetchTrips = async (changedQueries) => {
        try {
            const {markers: newMarkers, heatmapData: newHeatmapData, trips, bounds} =
                await fetchTrips(changedQueries, limit);

            if (isMounted.current) {
                setMarkers(newMarkers);
                setHeatmapData(newHeatmapData);
                onFilteredTrips(trips);
            }

            if (bounds.length > 0) {
                map.fitBounds(bounds, {padding: [200, 200]});
            }
        } catch (error) {
            // Error is already logged in the service
        }
    };

    useDeepCompareEffect(() => {
        handleFetchTrips(queries);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queries]);

    const displayMarkers = markers.length > 0 && markers.length < 1000;

    return (
        <>
            {displayMarkers ? (
                <FeatureGroup>
                    {markers.map((m, idx) => (
                        <CircleMarker
                            key={idx}
                            center={m.position}
                            pathOptions={{color: m.color, fillColor: m.color}}
                            {...markerStyle}
                        />
                    ))}
                </FeatureGroup>
            ) : (
                <FeatureGroup>
                    <HeatmapLayer
                        {...heatmapOptions}
                        latlngs={heatmapData}
                    />
                </FeatureGroup>

            )}
        </>
    );
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
    markerStyle: PropTypes.object,
    heatmapOptions: PropTypes.object,
    markerColors: PropTypes.shape({
        pickup: PropTypes.string,
        dropoff: PropTypes.string,
    }),
};

export default TaxisVisGeoSpatialManager;
