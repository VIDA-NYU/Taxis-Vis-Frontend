import React from "react";
import PropTypes from "prop-types";
import Plot from "react-plotly.js";
import "./PlotVisualisationPanel.styles.css";

const PlotVisualisationPanel = ({
                                    isVisible,
                                    title = "Visualization",
                                    plotData,
                                    plotLayout,
                                    onClose,
                                }) => {
    return (
        <>
            <div
                className={`plot_visualisation-backdrop ${
                    isVisible ? "visible" : ""
                }`}
                onClick={onClose}
            ></div>

            <div
                className={`plot_visualisation-panel ${
                    isVisible ? "visible" : ""
                }`}
            >
                <div className="plot_visualisation-header">
                    <h2>{title}</h2>
                    <button
                        className="plot_visualisation-close-btn"
                        onClick={onClose}
                        aria-label="Close visualization"
                    >
                        &times;
                    </button>
                </div>

                <div className="plot_visualisation-content">
                    {plotData && plotLayout ? (
                        <Plot
                            data={plotData}
                            layout={{
                                ...plotLayout,
                                autosize: true,
                                margin: {t: 40, l: 40, r: 40, b: 40},
                                paper_bgcolor: "rgb(0,0,0,0)",
                                plot_bgcolor: "rgb(0,0,0,0)",
                            }}
                            style={{width: "100%", height: "100%"}}
                        />
                    ) : (
                        <div className="plot_visualisation-no-data">
                            <p>No data available</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

PlotVisualisationPanel.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    title: PropTypes.string,
    plotData: PropTypes.array,
    plotLayout: PropTypes.object,
    onClose: PropTypes.func.isRequired,
};

export default PlotVisualisationPanel;
