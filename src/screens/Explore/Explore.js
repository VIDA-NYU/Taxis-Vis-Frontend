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
    const [features, setFeatures] = useState({
        pickup: [],
        dropoff: [],
        directional: [],
    });

    const [queries, setQueries] = useState([]);
    const [nycGeoJson, setNycGeoJson] = useState(null);
    const [nycParksGeoJson, setNycParksGeoJson] = useState(null);
    const [nycNeighbourhoodsGeoJson, setNycNeighbourhoodsGeoJson] = useState(null);
    const [bufferDistance, setBufferDistance] = useState(600);

    const [filteredTrips, setFilteredTrips] = useState([]);
    const [isPlotlyVisible, setIsPlotlyVisible] = useState(false);
    const [currentPlot, setCurrentPlot] = useState({
        title: "",
        plotData: null,
        plotLayout: null,
    });

    const [dateRange, setDateRange] = useState({start: null, end: null});

    useEffect(() => {
        const loadGeoJson = async () => {
            try {
                const nycData = await fetchGeoJson("/nyc.geojson");
                setNycGeoJson(nycData);

                const parksData = await fetchGeoJson("/parks.geojson");
                setNycParksGeoJson(parksData);

                const neighbourhoodsData = await fetchGeoJson("/nyc_neighboroods.geojson");
                setNycNeighbourhoodsGeoJson(neighbourhoodsData);
            } catch (error) {
                // Errors are already logged in fetchGeoJson
            }
        };

        loadGeoJson();
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
        setFeatures(updated);
        const q = consolidateQueries(updated);
        setQueries(q);
    };

    const handleDateRangeChange = (newRange) => {
        const formattedRange = {
            start: newRange.start?.toDate() || null,
            end: newRange.end?.toDate() || null,
        };
        setDateRange(formattedRange);
        const updatedQueries = consolidateQueries(features, formattedRange);
        setQueries(updatedQueries);
    };

    useEffect(() => {
        updateFeaturesAndQueries(features);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange]);

    const analyses = [
        {name: "Trip Duration Histogram", endpoint: "trip-duration-histogram", icon: <HourglassIcon/>},
        {name: "Peak Hours Bar Chart", endpoint: "peak-hours-bar", icon: <LineStyleIcon/>},
        {name: "Fare Distribution Box Plot", endpoint: "fare-distribution-box", icon: <MoneyIcon/>},
        {name: "Passenger Count Pie Chart", endpoint: "passenger-count-pie", icon: <UserIcon/>},
        {name: "Payment Type Pie Chart", endpoint: "payment-type-pie", icon: <CreditCardIcon/>},
        {name: "Tip Amount Box Plot", endpoint: "tip-amount-box", icon: <MoneyIcon/>},
        {name: "Distance-Fare Scatter Plot", endpoint: "distance-fare-scatter-plot", icon: <ScatterPlotIcon/>},
        {name: "Time Series Line Chart", endpoint: "time-series-line", icon: <LineStyleIcon/>},
    ];

    const handleClosePlotly = () => {
        setIsPlotlyVisible(false);
        setCurrentPlot({title: "", plotData: null, plotLayout: null});
    };

    const layers = [
        {
            id: "nyc-layer",
            name: "NYCBoroughs",
            geojsonData: nycGeoJson,
            style: {color: "#4E3FC8", weight: 2, opacity: 0.5},
        },
        {
            id: "nyc-neighbourhoods-layer",
            name: "NYCNeighbourhoods",
            geojsonData: nycNeighbourhoodsGeoJson,
            style: {color: "#8206a9", weight: 2, opacity: 0.5},
        },
        {
            id: "nyc-parks-layer",
            name: "NYCParks",
            geojsonData: nycParksGeoJson,
            style: {color: "#298008", weight: 2, opacity: 0.5},
        },
    ];

    return (
        <Provider theme={defaultTheme} colorScheme="light">
            <div className="home-app-container">
                <CoreMap tileLayer="cartoLight">
                    {nycGeoJson && <GeoJsonLayersPanel layers={layers} position="bottom-right"/>}
                    <ToolbarPanel
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
                        onFilteredTrips={(filtered) => {
                            setFilteredTrips(filtered);
                        }}
                        markerStyle={{radius: 4}}
                        heatmapOptions={{
                            radius: 20,
                            blur: 15,
                            max: 1.0,
                            gradient: {
                                0.4: "orange",
                                0.65: "yellow",
                                1: "red",
                            },
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

Explore.propTypes = {};

export default Explore;
