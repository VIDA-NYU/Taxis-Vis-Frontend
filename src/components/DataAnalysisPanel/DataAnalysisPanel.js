import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import './DataAnalysisPanel.styles.css';
import {uploadTripsForAnalysis, checkAvailableAnalyses} from './DataAnalysisPanel.services';
import {API_URLS} from "../../config/apiUrls";

const NotificationPanel = ({notifications, onClick}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            <div
                className="analysis_panel-hover-container"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            ></div>
            <div
                className={`analysis_panel-panel ${isHovered ? 'expanded' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {notifications.map((notification, index) => {
                    const isExpanded = isHovered;
                    const offset = isExpanded ? `${index * 20}px` : `${index * 25}px`;
                    const opacity = isExpanded ? 1 : 1 - index * 0.15;
                    const disabled = notification.disabled;

                    return (
                        <div
                            key={notification.id}
                            className={`analysis_panel-card ${isExpanded ? 'expanded' : ''} ${disabled ? 'disabled' : ''}`}
                            style={{
                                '--stack-offset': offset,
                                '--expanded-offset': `${index * 55}px`,
                                '--stack-opacity': opacity,
                                '--stack-index': index,
                                cursor: disabled ? "not-allowed" : "pointer",
                                opacity: disabled ? 0.5 : 1,
                            }}
                            onClick={() => !disabled && onClick(notification)}
                            onMouseEnter={() => !disabled && setIsHovered(true)}
                            onMouseLeave={() => !disabled && setIsHovered(false)}
                            title={disabled ? "This analysis requires missing dataset columns." : ""}
                        >
                            <div className="analysis_panel-content">
                                <div className="analysis_panel-icon">{notification.icon}</div>
                                <div className="analysis_panel-text">
                                    <div className="analysis_panel-title">{notification.title}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};


const fetchConfig = async () => {
    try {
        const response = await fetch(`${API_URLS.CONFIG}`);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || Object.keys(data).length === 0) {
            throw new Error("Empty config received");
        }

        return data;
    } catch (error) {
        console.error("Error fetching dataset configuration:", error);
        return null;
    }
};

const DataAnalysisPanel = ({analyses, onPlotReady, filteredTrips}) => {
    const [config, setConfig] = useState(null);
    const [disabledAnalyses, setDisabledAnalyses] = useState({});

    useEffect(() => {
        const loadConfig = async () => {
            const fetchedConfig = await fetchConfig();
            if (fetchedConfig) setConfig(fetchedConfig);
        };
        loadConfig();
    }, []);

    useEffect(() => {
        if (config && filteredTrips.length > 0) {

            const availableColumns = checkAvailableAnalyses(
                filteredTrips,
                config?.database?.databaseDescription?.data_analysis_backend_required_columns || []
            );

            const disabledState = Object.fromEntries(
                analyses.map(analysis => [
                    analysis.name,
                    analysis.requiredColumns.every(column => availableColumns[column])
                ])
            );

            setDisabledAnalyses(disabledState);
        }
    }, [config, filteredTrips]);

    const handleAnalysisClick = async (analysis) => {
        if (!config) {
            alert("Configuration is not loaded. Please try again.");
            return;
        }

        try {
            const result = await uploadTripsForAnalysis(analysis, filteredTrips, config);
            onPlotReady({
                title: analysis.name,
                data: result?.chart?.data,
                layout: result?.chart?.layout,
            });
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <NotificationPanel
            notifications={analyses.map((analysis, index) => ({
                id: index,
                title: analysis.name,
                icon: analysis.icon,
                disabled: !disabledAnalyses[analysis.name] || filteredTrips.length === 0,
            }))}
            onClick={(notification) => {
                const analysis = analyses[notification.id];
                if (!analysis.disabled) {
                    handleAnalysisClick(analysis);
                }
            }}
        />
    );
};

NotificationPanel.propTypes = {
    notifications: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            icon: PropTypes.node,
            title: PropTypes.string.isRequired,
        })
    ).isRequired,
    onClick: PropTypes.func.isRequired,
};

DataAnalysisPanel.propTypes = {
    analyses: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            endpoint: PropTypes.string.isRequired,
            icon: PropTypes.node,
            requiredColumns: PropTypes.arrayOf(PropTypes.string),
        })
    ).isRequired,
    onPlotReady: PropTypes.func.isRequired,
    filteredTrips: PropTypes.array.isRequired,
};

export default DataAnalysisPanel;
