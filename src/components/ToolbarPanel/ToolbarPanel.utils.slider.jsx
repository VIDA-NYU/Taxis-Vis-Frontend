import React from "react";
import PropTypes from "prop-types";
import Slider from "@mui/material/Slider";

const ToolbarPanelUtilsSlider = ({
                                bufferDistance,
                                onBufferDistanceChange,
                                label = "Buffer Distance",
                                minValue = 100,
                                maxValue = 2000,
                                step = 100,
                            }) => {
    const handleSliderChange = (_, newValue) => {
        onBufferDistanceChange(newValue);
    };

    return (
        <div className="toolbar_panel-slider">
            <span>{label}: {bufferDistance}m</span>
            <Slider
                value={bufferDistance}
                onChange={handleSliderChange}
                aria-labelledby="buffer-slider"
                valueLabelDisplay="auto"
                step={step}
                marks
                min={minValue}
                max={maxValue}
            />
        </div>
    );
};

ToolbarPanelUtilsSlider.propTypes = {
    bufferDistance: PropTypes.number.isRequired,
    onBufferDistanceChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    step: PropTypes.number
};

export default ToolbarPanelUtilsSlider;
