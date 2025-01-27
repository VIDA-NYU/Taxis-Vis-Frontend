import React, {useState} from 'react';
import PropTypes from 'prop-types';
import './DataAnalysisPanel.styles.css';
import {uploadTripsForAnalysis} from './DataAnalysisPanel.services';

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
                    const offset = isExpanded ? `${index * 20}px` : `${index * 20}px`;
                    const opacity = isExpanded ? 1 : 1 - index * 0.15;

                    return (
                        <div
                            key={notification.id}
                            className={`analysis_panel-card ${isExpanded ? 'expanded' : ''}`}
                            style={{
                                '--stack-offset': offset,
                                '--expanded-offset': `${index * 55}px`,
                                '--stack-opacity': opacity,
                                '--stack-index': index,
                            }}
                            onClick={() => onClick(notification)}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
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

const DataAnalysisPanel = ({analyses, onPlotReady, filteredTrips}) => {
    const handleAnalysisClick = async (analysis) => {
        try {
            const result = await uploadTripsForAnalysis(analysis, filteredTrips);
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
            }))}
            onClick={(notification) => {
                const analysis = analyses[notification.id];
                handleAnalysisClick(analysis);
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
            additionalParams: PropTypes.object,
        })
    ).isRequired,
    onPlotReady: PropTypes.func.isRequired,
    filteredTrips: PropTypes.array.isRequired,
};

export default DataAnalysisPanel;
