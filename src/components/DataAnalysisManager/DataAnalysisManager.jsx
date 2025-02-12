import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './DataAnalysisManager.styles.css';
import {
  uploadTripsForAnalysis,
  checkAvailableAnalyses,
  fetchConfig,
} from './DataAnalysisManager.services';
import { NotificationPanel } from './DataAnalysisManager.utils.notificationPanel';

const DataAnalysisManager = ({ analyses, onPlotReady, filteredTrips }) => {
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
        config?.required_columns || []
      );

      const disabledState = Object.fromEntries(
        analyses.map((analysis) => [
          analysis.name,
          analysis.requiredColumns.every((column) => availableColumns[column]),
        ])
      );

      setDisabledAnalyses(disabledState);
    }
  }, [config, filteredTrips]);

  const handleAnalysisClick = async (analysis) => {
    if (!config) {
      alert('Configuration is not loaded. Please try again.');
      return;
    }

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
        disabled:
          !disabledAnalyses[analysis.name] || filteredTrips.length === 0,
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

DataAnalysisManager.propTypes = {
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

export default DataAnalysisManager;
