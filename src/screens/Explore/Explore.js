import React, {useEffect, useState} from "react";
import {Provider, defaultTheme} from "@adobe/react-spectrum";
import CoreMap from "../../components/CoreMap/CoreMap";
import GeoJsonLayersPanel from "../../components/GeoJsonLayersPanel/GeoJsonLayersPanel";
import ToolbarPanel from "../../components/ToolbarPanel/ToolbarPanel";
import TaxisVisGeoSpatialManager from "../../components/TaxisVisGeoSpatialManager/TaxisVisGeoSpatialManager";
import QueryDescriptionPanel from "../../components/QueryDescriptionPanel/QueryDescriptionPanel";
import DataAnalysisPanel from "../../components/DataAnalysisPanel/DataAnalysisPanel";
import PlotVisualisationPanel from "../../components/PlotVisualisationPanel/PlotVisualisationPanel";
import {
    AttachMoney as MoneyIcon,
    CreditCard as CreditCardIcon,
    HourglassTop as HourglassIcon,
    LineStyle as LineStyleIcon,
    ScatterPlot as ScatterPlotIcon
} from "@mui/icons-material";
import "./Explore.styles.css";
import {loadMapConfig, loadGeoJsonLayers} from "./Explore.config";
import useDrawFeatures from "./Explore.useDrawFeatures";

const Explore = () => {
    const [mapConfig, setMapConfig] = useState(null);
    const [geoJsonLayers, setGeoJsonLayers] = useState([]);
    const [bufferDistance, setBufferDistance] = useState(600);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [dateRange, setDateRange] = useState({start: null, end: null});
    const {
        features,
        queries,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleDateRangeChange
    } = useDrawFeatures(bufferDistance, dateRange, setDateRange);
    const [isPlotlyVisible, setIsPlotlyVisible] = useState(false);
    const [currentPlot, setCurrentPlot] = useState({
        title: "",
        plotData: null,
        plotLayout: null
    });

    const getNewDateRange = (newRange) => {
        setDateRange({
            start: newRange.start ? newRange.start.toDate() : null,
            end: newRange.end ? newRange.end.toDate() : null
        });
    }

    useEffect(() => {
        (async () => {
            const config = await loadMapConfig();
            setMapConfig(config?.mapSettings);
            const layers = await loadGeoJsonLayers(config?.geoJsonLayers || []);
            console.log("layers", layers);
            setGeoJsonLayers(layers);
        })();
    }, []);

    return (
        <Provider theme={defaultTheme} colorScheme="light">
            <div className="home-app-container">
                {mapConfig && (
                    <CoreMap
                        tileLayer={mapConfig.tileLayer || "mapbox://styles/mapbox/streets-v12"}
                        center={mapConfig.center || [40.7128, -74.0060]}
                        zoom={mapConfig.zoom || 12}
                    >
                        {geoJsonLayers.length > 0 && (
                            <GeoJsonLayersPanel layers={geoJsonLayers} position="bottom-right"/>
                        )}
                        <ToolbarPanel
                            center={mapConfig.center || [40.7128, -74.0060]}
                            features={features}
                            onCreate={handleCreate}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
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
                                gradient: {0.4: "orange", 0.65: "yellow", 1: "red"}
                            }}
                            markerColors={{pickup: "blue", dropoff: "orange"}}
                            limit={100000}
                        />
                        <QueryDescriptionPanel
                            queries={queries}
                            limit={100000}
                            timeRange={dateRange}
                        />
                    </CoreMap>
                )}
                <DataAnalysisPanel
                    position="top-right"
                    analyses={[
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
                            icon: <CreditCardIcon/>,
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
                    ]}
                    onPlotReady={(chart) => {
                        setCurrentPlot({
                            title: chart.name,
                            plotData: chart.data,
                            plotLayout: chart.layout
                        });
                        setIsPlotlyVisible(true);
                    }}
                    filteredTrips={filteredTrips}
                />
                <PlotVisualisationPanel
                    isVisible={isPlotlyVisible}
                    title={currentPlot.title}
                    plotData={currentPlot.plotData}
                    plotLayout={currentPlot.plotLayout}
                    onClose={() => {
                        setIsPlotlyVisible(false);
                        setCurrentPlot({title: "", plotData: null, plotLayout: null});
                    }}
                />
            </div>
        </Provider>
    );
};

export default Explore;
