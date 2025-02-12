import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import './QueryDescriptionPanel.styles.css';
import { fetchDescriptions } from './QueryDescriptionPanel.services';

const QueryDescriptionPanel = ({
  queries,
  timeRange,
  geoJsonLayers,
  config,
}) => {
  const [descriptions, setDescriptions] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!queries || !queries.length) {
      if (descriptions.length > 0) setDescriptions([]);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchDescriptions(queries, geoJsonLayers, config);
        setDescriptions(data);
      } catch (error) {
        console.error('Failed to fetch descriptions from DuckDB:', error);
      }
    };

    fetchData();
  }, [queries]);

  const formatDateRange = (range) => {
    if (!range.start || !range.end) return null;

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const startDate = new Date(range.start).toLocaleDateString(
      undefined,
      options
    );
    const endDate = new Date(range.end).toLocaleDateString(undefined, options);

    return `${startDate} - ${endDate}`;
  };

  const formattedTimeRange = formatDateRange(timeRange);

  const renderStackedList = (zones) => {
    if (!zones || zones.length === 0) return null;

    const displayedZones = zones.slice(0, 3);
    const remainingCount = zones.length - displayedZones.length;

    return (
      <div className='query_description-stacked-list'>
        {displayedZones.map((zone, index) => (
          <div
            key={index}
            className='query_description-stacked-zone'
            style={{ '--stack-index': index }}
          >
            {zone}
          </div>
        ))}
        {remainingCount > 0 && (
          <Tooltip title={zones.slice(3).join(', ')}>
            <div className='query_description-more-zones'>
              +{remainingCount} More
            </div>
          </Tooltip>
        )}
      </div>
    );
  };

  if (!descriptions || descriptions.length === 0) return null;

  return (
    <div
      className={`query_description-wrapper ${
        isVisible ? 'visible' : 'hidden'
      }`}
      onClick={() => setIsVisible(!isVisible)}
    >
      {!isVisible && <div className='query_description-eye-icon'></div>}
      {isVisible && (
        <div className='query_description-container'>
          {formattedTimeRange && (
            <div className='query_description-time-range'>
              <strong>Time Range:</strong> {formattedTimeRange}
            </div>
          )}

          {descriptions.map((desc, idx) => (
            <div key={idx} className='query_description-item'>
              {desc.pickupZones && desc.pickupZones.length > 0 && (
                <div className='query_description-stacked-section'>
                  {renderStackedList(desc.pickupZones)}
                  <div className='query_description-inline-header'>
                    Pickup Zones
                  </div>
                </div>
              )}
              {desc.viaZone && (
                <div className='query_description-inline-header query_description-via-zone'>
                  Via <br /> <em>{desc.viaZone}</em>
                </div>
              )}
              {desc.dropoffZones && desc.dropoffZones.length > 0 && (
                <div className='query_description-stacked-section'>
                  <div className='query_description-inline-header'>
                    Dropoff Zones
                  </div>
                  {renderStackedList(desc.dropoffZones)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

QueryDescriptionPanel.propTypes = {
  queries: PropTypes.arrayOf(PropTypes.object).isRequired,
  timeRange: PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  }),
};

export default QueryDescriptionPanel;
