import React, {useEffect, useState} from "react";
import CoreMap from "../../components/CoreMap/CoreMap";
import GeoJsonLayersPanel from "../../components/GeoJsonLayersPanel/GeoJsonLayersPanel";
import QueryDescriptionPanel from "../../components/QueryDescriptionPanel/QueryDescriptionPanel";
import DataAnalysisPanel from "../../components/DataAnalysisPanel/DataAnalysisPanel";
import PlotVisualisationPanel from "../../components/PlotVisualisationPanel/PlotVisualisationPanel";
import {Provider, defaultTheme} from "@adobe/react-spectrum";
import {
    AccountCircle as UserIcon,
    AttachMoney as MoneyIcon,
    CreditCard as CreditCardIcon,
    HourglassTop as HourglassIcon,
    LineStyle as LineStyleIcon,
    ScatterPlot as ScatterPlotIcon,
} from "@mui/icons-material";
import ToolbarPanel from "../../components/ToolbarPanel/ToolbarPanel";
import TaxisVisGeoSpatialManager from "../../components/TaxisVisGeoSpatialManager/TaxisVisGeoSpatialManager";
import "./Explore.styles.css";
import {fetchGeoJson} from "./Explore.services";

const Explore = () => {
    const [mapConfig, setMapConfig] = useState(null);
    const [geoJsonLayers, setGeoJsonLayers] = useState([]);
    const [features, setFeatures] = useState({pickup: [], dropoff: [], directional: []});
    const [queries, setQueries] = useState([]);
    const [bufferDistance, setBufferDistance] = useState(600);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [isPlotlyVisible, setIsPlotlyVisible] = useState(false);
    const [currentPlot, setCurrentPlot] = useState({title: "", plotData: null, plotLayout: null});
    const [dateRange, setDateRange] = useState({start: null, end: null});

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const response = await fetch("/config/mapConfig.json");
                const config = await response.json();
                setMapConfig(config?.mapSettings || {});

                const layersData = await Promise.all(
                    config.geoJsonLayers.map(async (layer) => ({
                        ...layer,
                        geojsonData: await fetchGeoJson(layer.url),
                    }))
                );
                setGeoJsonLayers(layersData);
            } catch (error) {
                console.error("Error loading map configuration:", error);
            }
        };

        loadConfig();
    }, []);

    const consolidateQueries = (featuresParam, dateRangeOverride = dateRange) => {
        const {pickup, dropoff, directional} = featuresParam;
        const result = [];

        if (directional.length > 0 && pickup.length > 0 && dropoff.length > 0) {
            directional.forEach((line) => {
                result.push({
                    type: "directional",
                    pickupRegion: pickup[0].geometry,
                    dropoffRegion: dropoff[0].geometry,
                    lineCoordinates: line.geometry.coordinates,
                    buffer: bufferDistance,
                    fromDate: dateRangeOverride.start,
                    toDate: dateRangeOverride.end,
                });
            });
            return result;
        }

        if (pickup.length > 0 && dropoff.length > 0) {
            result.push({
                type: "pickup-dropoff",
                pickupRegion: pickup[0].geometry,
                dropoffRegion: dropoff[0].geometry,
                fromDate: dateRangeOverride.start,
                toDate: dateRangeOverride.end,
            });
            return result;
        }

        if (pickup.length > 0) {
            result.push({
                type: "pickup",
                region: pickup[0].geometry,
                fromDate: dateRangeOverride.start,
                toDate: dateRangeOverride.end,
            });
        }

        if (dropoff.length > 0) {
            result.push({
                type: "dropoff",
                region: dropoff[0].geometry,
                fromDate: dateRangeOverride.start,
                toDate: dateRangeOverride.end,
            });
        }

        return result;
    };

    const handleCreate = ({type, feature}) => {
        const updatedFeatures = {
            ...features,
            [type]: [...(features[type] || []), feature],
        };
        updateFeaturesAndQueries(updatedFeatures);
    };

    const handleUpdate = (updatedFeatures) => {
        const grouped = {pickup: [], dropoff: [], directional: []};
        updatedFeatures.forEach(({type, feature}) => {
            grouped[type].push(feature);
        });
        updateFeaturesAndQueries(grouped);
    };

    const handleDelete = (remainingFeatures) => {
        const grouped = {pickup: [], dropoff: [], directional: []};
        remainingFeatures.forEach(({type, feature}) => {
            grouped[type].push(feature);
        });
        updateFeaturesAndQueries(grouped);
    };

    const updateFeaturesAndQueries = (updated) => {
        const temp_updated = Array.isArray(updated) && updated.length === 0
            ? {pickup: [], dropoff: [], directional: []}
            : updated;

        setFeatures(temp_updated);
        setQueries(consolidateQueries(temp_updated));
    };

    const handleDateRangeChange = (newRange) => {
        const formattedRange = {
            start: newRange.start?.toDate() || null,
            end: newRange.end?.toDate() || null,
        };
        setDateRange(formattedRange);
        setQueries(consolidateQueries(features, formattedRange));
    };

    useEffect(() => {
        updateFeaturesAndQueries(features);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange]);

    const analyses = [
        {
            name: "Trip Duration Histogram",
            endpoint: "trip-duration-histogram",
            icon: <HourglassIcon/>,
            requiredColumns: ["pickup_datetime", "dropoff_datetime"]
        },
        {
            name: "Peak Hours Bar Chart",
            endpoint: "peak-hours-bar",
            icon: <LineStyleIcon/>,
            requiredColumns: ["pickup_datetime"]
        },
        {
            name: "Fare Distribution Box Plot",
            endpoint: "fare-distribution-box",
            icon: <MoneyIcon/>,
            requiredColumns: ["fare_amount"]
        },
        {
            name: "Passenger Count Pie Chart",
            endpoint: "passenger-count-pie",
            icon: <UserIcon/>,
            requiredColumns: ["passenger_count"]
        },
        {
            name: "Payment Type Pie Chart",
            endpoint: "payment-type-pie",
            icon: <CreditCardIcon/>,
            requiredColumns: ["payment_type"]
        },
        {
            name: "Tip Amount Box Plot",
            endpoint: "tip-amount-box",
            icon: <MoneyIcon/>,
            requiredColumns: ["tip_amount"]
        },
        {
            name: "Distance-Fare Scatter Plot",
            endpoint: "distance-fare-scatter-plot",
            icon: <ScatterPlotIcon/>,
            requiredColumns: ["trip_distance", "fare_amount"]
        },
        {
            name: "Time Series Line Chart",
            endpoint: "time-series-line",
            icon: <LineStyleIcon/>,
            requiredColumns: ["pickup_datetime"]
        }
    ];

    const handleClosePlotly = () => {
        setIsPlotlyVisible(false);
        setCurrentPlot({title: "", plotData: null, plotLayout: null});
    };

    return (
        <Provider theme={defaultTheme} colorScheme="light">
            <div className="home-app-container">
                {mapConfig && (
                    <CoreMap
                        tileLayer={mapConfig.tileLayer || "cartoLight"}
                        center={mapConfig.center || [40.7128, -74.0060]}
                        zoom={mapConfig.zoom || 12}
                    >
                        {geoJsonLayers.length > 0 && (
                            <GeoJsonLayersPanel layers={geoJsonLayers} position="bottom-right"/>
                        )}
                        <ToolbarPanel
                            features={features}
                            onCreate={(created) => handleCreate(created)}
                            onUpdate={(updated) => handleUpdate(updated)}
                            onDelete={(remaining) => handleDelete(remaining)}
                            bufferDistance={bufferDistance}
                            setBufferDistance={setBufferDistance}
                            onDateRangeChange={handleDateRangeChange}
                        />
                        <TaxisVisGeoSpatialManager
                            queries={queries}
                            onFilteredTrips={setFilteredTrips}
                            markerStyle={{radius: 4}}
                            heatmapOptions={{
                                radius: 20,
                                blur: 15,
                                max: 1.0,
                                gradient: {0.4: "orange", 0.65: "yellow", 1: "red"},
                            }}
                            markerColors={{pickup: "blue", dropoff: "orange"}}
                            limit={100000}
                        />
                        <QueryDescriptionPanel queries={queries} limit={100000} timeRange={dateRange}/>
                    </CoreMap>
                )}
                <DataAnalysisPanel
                    position="top-right"
                    analyses={analyses}
                    filteredTrips={filteredTrips}
                    onPlotReady={(chart) => {
                        setCurrentPlot({
                            title: chart.name,
                            plotData: chart.data,
                            plotLayout: chart.layout,
                        });
                        setIsPlotlyVisible(true);
                    }}
                />
                <PlotVisualisationPanel
                    isVisible={isPlotlyVisible}
                    title={currentPlot.title}
                    plotData={currentPlot.plotData}
                    plotLayout={currentPlot.plotLayout}
                    onClose={handleClosePlotly}
                />
            </div>
        </Provider>
    );
};

export default Explore;
