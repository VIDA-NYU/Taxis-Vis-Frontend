import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {useMap} from "react-leaflet";
import {parseDate} from "@internationalized/date";
import {
    Hail,
    Tour,
    Moving,
    EditRoad,
    RemoveRoad,
    ExpandLess,
    ExpandMore,
    DateRange,
} from "@mui/icons-material";
import {DateRangePicker} from "@adobe/react-spectrum";
import "./ToolbarPanel.styles.css";
import {fetchAvailableDateRange} from "./ToolbarPanel.services";
import ToolbarPanelButton from "./ToolbarPanel.button";
import ToolbarPanelSlider from "./ToolbarPanel.slider";
import {useLeafletDrawHandlers} from "./ToolbarPanel.useLeafletDrawHandlers";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const ToolbarPanel = ({
                          mapApiUrl = "http://localhost:4000/api/trips/date-range",
                          features,
                          onCreate,
                          onUpdate,
                          onDelete,
                          onDateRangeChange,
                          bufferDistance,
                          setBufferDistance,
                          defaultDrawingColorPickup = "blue",
                          defaultDrawingColorDropoff = "red",
                          defaultDrawingColorDirectional = "green",
                      }) => {
    const map = useMap();
    const drawnItemsRef = useRef(new L.FeatureGroup());

    const [activeButton, setActiveButton] = useState(null);
    const [isMinimized, setIsMinimized] = useState(false);
    const [initialDateRange, setInitialDateRange] = useState({});
    const [localDateRange, setLocalDateRange] = useState({});
    const isSliderVisible = activeButton === "directional";
    const isDatePickerVisible = activeButton === "calendar";

    const hasPickupAndDropoff = features.pickup.length > 0 && features.dropoff.length > 0;
    const hasAnyFeature =
        features.pickup.length > 0 ||
        features.dropoff.length > 0 ||
        features.directional.length > 0;

    const {activateDrawing, activateEditing, activateDeleting} = useLeafletDrawHandlers({
        map,
        drawnItemsRef,
        onCreate,
        onUpdate,
        onDelete,
        setActiveButton,
        defaultPickupColor: defaultDrawingColorPickup,
        defaultDropoffColor: defaultDrawingColorDropoff,
        defaultDirectionalColor: defaultDrawingColorDirectional,
    });

    useEffect(() => {
        (async () => {
            const data = await fetchAvailableDateRange(mapApiUrl);
            if (data?.startDate && data?.endDate) {
                const start = parseDate(data.startDate.split("T")[0]);
                const end = parseDate(data.endDate.split("T")[0]);
                setInitialDateRange({start, end});
                setLocalDateRange({start, end});
            }
        })();
    }, [mapApiUrl]);

    const handleButtonClick = (buttonType, action) => {
        setActiveButton((prev) => {
            const nextState = prev === buttonType ? null : buttonType;
            if (action) action(nextState);
            return nextState;
        });
    };

    return (
        <>
            <div className={`toolbar_panel-container ${isMinimized ? "minimized" : ""}`}>
                <div className="toolbar_panel-minimize-btn-container">
                    <ToolbarPanelButton
                        icon={isMinimized ? <ExpandMore/> : <ExpandLess/>}
                        title={isMinimized ? "Expand Toolbar" : "Minimize Toolbar"}
                        onClick={() => setIsMinimized(!isMinimized)}
                        isDisabled={!!activeButton}
                        ariaLabel={isMinimized ? "Expand Toolbar" : "Minimize Toolbar"}
                    />
                </div>

                {!isMinimized && (
                    <>
                        <ToolbarPanelButton
                            icon={<Hail/>}
                            title="Draw A Pickup ROI"
                            onClick={() => handleButtonClick("pickup", (nextState) => nextState && activateDrawing("pickup"))}
                            isActive={activeButton === "pickup"}
                            isDisabled={features.pickup.length > 0}
                            extraClasses="pickup"
                            ariaLabel="Draw A Pickup ROI"
                        />

                        <ToolbarPanelButton
                            icon={<Tour/>}
                            title="Draw A Dropoff ROI"
                            onClick={() => handleButtonClick("dropoff", (nextState) => nextState && activateDrawing("dropoff"))}
                            isActive={activeButton === "dropoff"}
                            isDisabled={features.dropoff.length > 0}
                            extraClasses="dropoff"
                            ariaLabel="Draw A Dropoff ROI"
                        />

                        <ToolbarPanelButton
                            icon={<Moving/>}
                            title="Draw A Directional Line"
                            onClick={() =>
                                handleButtonClick(
                                    "directional",
                                    (nextState) => {
                                        if (nextState) activateDrawing("directional");
                                    }
                                )
                            }
                            isActive={activeButton === "directional"}
                            isDisabled={!hasPickupAndDropoff || features.directional.length > 0}
                            extraClasses="directional"
                            ariaLabel="Draw A Directional Line"
                        />

                        <ToolbarPanelButton
                            icon={<EditRoad/>}
                            title="Edit Existing ROI"
                            onClick={() => {
                                if (hasAnyFeature) {
                                    activateEditing();
                                    setActiveButton((prev) => (prev === "edit" ? null : "edit"));
                                }
                            }}
                            isActive={activeButton === "edit"}
                            isDisabled={!hasAnyFeature}
                            extraClasses="action"
                            ariaLabel="Edit Existing ROI"
                        />

                        <ToolbarPanelButton
                            icon={<RemoveRoad/>}
                            title="Delete Existing ROI"
                            onClick={() => {
                                if (hasAnyFeature) {
                                    activateDeleting();
                                    setActiveButton((prev) => (prev === "delete" ? null : "delete"));
                                }
                            }}
                            isActive={activeButton === "delete"}
                            isDisabled={!hasAnyFeature}
                            extraClasses="action"
                            ariaLabel="Delete Existing ROI"
                        />

                        <ToolbarPanelButton
                            icon={<DateRange/>}
                            title="Select Date Range"
                            onClick={() => {
                                const nextState = !isDatePickerVisible;
                                setActiveButton((prev) => (prev === "calendar" ? null : "calendar"));

                                if (!nextState && onDateRangeChange) {
                                    onDateRangeChange(localDateRange);
                                }
                            }}
                            isActive={activeButton === "calendar"}
                            extraClasses="action"
                            ariaLabel="Select Date Range"
                        />
                    </>
                )}
            </div>

            {isDatePickerVisible && (
                <div className="toolbar_panel-date-picker">
                    <DateRangePicker
                        label="From - To"
                        value={localDateRange}
                        onChange={setLocalDateRange}
                        maxVisibleMonths={2}
                        granularity="day"
                        labelPosition="side"
                        minValue={initialDateRange.start}
                        maxValue={initialDateRange.end}
                    />
                </div>
            )}

            {isSliderVisible && (
                <ToolbarPanelSlider
                    bufferDistance={bufferDistance}
                    onBufferDistanceChange={setBufferDistance}
                    label="Buffer Distance"
                    minValue={100}
                    maxValue={2000}
                    step={100}
                />
            )}
        </>
    );
};

ToolbarPanel.propTypes = {
    mapApiUrl: PropTypes.string,
    features: PropTypes.shape({
        pickup: PropTypes.array.isRequired,
        dropoff: PropTypes.array.isRequired,
        directional: PropTypes.array.isRequired,
    }).isRequired,
    onCreate: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onDateRangeChange: PropTypes.func,
    bufferDistance: PropTypes.number.isRequired,
    setBufferDistance: PropTypes.func.isRequired,
    defaultDrawingColorPickup: PropTypes.string,
    defaultDrawingColorDropoff: PropTypes.string,
    defaultDrawingColorDirectional: PropTypes.string,
};

export default ToolbarPanel;
