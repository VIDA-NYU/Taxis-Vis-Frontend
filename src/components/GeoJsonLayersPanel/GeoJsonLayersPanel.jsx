import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  add3DBuildingsLayer,
  toggle3DBuildingsVisibility,
} from './GeoJsonLayersPanel.utils';
import './GeoJsonLayersPanel.styles.css';

const GeoJsonLayersPanel = ({ layers, position = 'top-right', map }) => {
  const [visibility, setVisibility] = useState(
    layers.reduce((acc, layer) => {
      acc[layer.id] = true;
      return acc;
    }, {})
  );
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const updated = layers.reduce((acc, layer) => {
      acc[layer.id] = visibility[layer.id] ?? true;
      return acc;
    }, {});
    setVisibility(updated);
  }, [layers]);

  useEffect(() => {
    if (!map) return;

    layers.forEach((layer) => {
      if (layer.id === '3d-buildings') {
        add3DBuildingsLayer(map);
      } else {
        if (!map.getSource(layer.id)) {
          map.addSource(layer.id, {
            type: 'geojson',
            data: layer.geojsonData,
          });
        } else {
          map.getSource(layer.id).setData(layer.geojsonData);
        }

        const fillLayerId = `${layer.id}-fill`;
        if (!map.getLayer(fillLayerId)) {
          map.addLayer({
            id: fillLayerId,
            type: 'fill',
            source: layer.id,
            layout: { visibility: visibility[layer.id] ? 'visible' : 'none' },
            paint: {
              'fill-color': layer.style?.color || 'blue',
              'fill-opacity': layer.style?.opacity ?? 0.6,
            },
          });
        } else {
          map.setLayoutProperty(
            fillLayerId,
            'visibility',
            visibility[layer.id] ? 'visible' : 'none'
          );
        }

        const outlineLayerId = `${layer.id}-outline`;
        if (!map.getLayer(outlineLayerId)) {
          map.addLayer({
            id: outlineLayerId,
            type: 'line',
            source: layer.id,
            layout: { visibility: visibility[layer.id] ? 'visible' : 'none' },
            paint: {
              'line-color': layer.style?.color || 'blue',
              'line-width': layer.style?.weight || 2,
              'line-opacity': layer.style?.opacity || 0.6,
            },
          });
        } else {
          map.setLayoutProperty(
            outlineLayerId,
            'visibility',
            visibility[layer.id] ? 'visible' : 'none'
          );
        }
      }
    });
  }, [layers, map, visibility]);

  const toggleVisibility = (id) => {
    if (id === '3d-buildings') {
      const isVisible = toggle3DBuildingsVisibility(map);
      setVisibility((prev) => ({ ...prev, [id]: isVisible }));
    } else {
      setVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const toggleMinimized = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <div
      className={`geo_json_layers-panel ${position} ${isMinimized ? 'minimized' : ''}`}
    >
      <div
        className={`geo_json_layers-header ${isMinimized ? 'minimized' : ''}`}
      >
        <span>GeoJSON Layers</span>
        <Tooltip
          title={isMinimized ? 'Expand Legend' : 'Minimize Legend'}
          arrow
        >
          <IconButton
            className='geo_json_layers-minimize-btn small-btn'
            onClick={toggleMinimized}
            aria-label={isMinimized ? 'Expand Legend' : 'Minimize Legend'}
            size='small'
          >
            {isMinimized ? <ExpandMore /> : <ExpandLess />}
          </IconButton>
        </Tooltip>
      </div>

      {!isMinimized && (
        <div className='geo_json_layers-list'>
          {layers.map((layer) => (
            <div
              key={layer.id}
              className='geo_json_layers-item'
              onClick={() => toggleVisibility(layer.id)}
            >
              <div
                className='geo_json_layers-icon'
                style={{
                  backgroundColor:
                    layer.style?.color ||
                    (layer.id === '3d-buildings' ? '#aaa' : '#000'),
                }}
              />
              <span className='geo_json_layers-name'>{layer.name}</span>
              <input
                type='checkbox'
                checked={visibility[layer.id]}
                onChange={() => toggleVisibility(layer.id)}
                className='geo_json_layers-checkbox'
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

GeoJsonLayersPanel.propTypes = {
  layers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      geojsonData: PropTypes.object,
      style: PropTypes.object,
    })
  ).isRequired,
  position: PropTypes.oneOf([
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
  ]),
  map: PropTypes.object,
};

export default GeoJsonLayersPanel;
