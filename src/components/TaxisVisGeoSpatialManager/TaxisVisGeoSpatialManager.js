import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import {
  createDropoffMarkerEl,
  createPickupMarkerEl,
  dropoffHeatmapPaint,
  paintOverride,
  pickupHeatmapPaint,
} from './TaxisVisGeoSpatialManager.utils';

import { useDuckDb, runQuery } from 'duckdb-wasm-kit';

import { fetchData } from './TaxisVisGeoSpatialManager.services';
import { useAppConfig } from '../../providers/DuckDB/DuckDBProvider';

const TaxisVisGeoSpatialManager = ({
  queries,
  onFilteredTrips,
  limit = 100000,
  map,
}) => {
  const [markersData, setMarkersData] = useState([]);
  const [pickupHeatmapData, setPickupHeatmapData] = useState([]);
  const [dropoffHeatmapData, setDropoffHeatmapData] = useState([]);
  const markersRef = useRef([]);
  const config = useAppConfig();

  const pickupHeatLayerId = 'pickup-heatmap-layer';
  const dropoffHeatLayerId = 'dropoff-heatmap-layer';
  const pickupSourceId = 'pickup-heatmap-source';
  const dropoffSourceId = 'dropoff-heatmap-source';
  const THRESHOLD = 1000;

  const { db, loading, error } = useDuckDb();

  useEffect(() => {
    if (db) {
      (async () => {
        await runQuery(db, 'INSTALL spatial; LOAD spatial;');
      })();
    }
  }, [db]);

  useEffect(() => {
    if (!db || !queries || queries.length === 0 || loading || error) {
      clearMarkers();
      removeAllHeatmaps();
      return;
    }

    fetchData(
      db,
      queries,
      (markersData) => setMarkersData(markersData),
      (pickupHeatmapData) => setPickupHeatmapData(pickupHeatmapData),
      (dropoffHeatmapData) => setDropoffHeatmapData(dropoffHeatmapData),
      (filteredTrips) => onFilteredTrips(filteredTrips),
      config,
      limit
    );
  }, [db, queries, limit]);

  const addMarkers = (markers) => {
    clearMarkers();
    markers.forEach((m) => {
      let el;
      if (m.type === 'pickup') {
        el = createPickupMarkerEl();
      } else {
        el = createDropoffMarkerEl();
      }

      const pos = [m.position[1], m.position[0]];

      const marker = new mapboxgl.Marker(el, { anchor: 'center' })
        .setLngLat(pos)
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  const addOrUpdateHeatmapLayer = (
    featuresData,
    sourceId,
    layerId,
    paintOverrides
  ) => {
    if (!map) return;

    const geojson = {
      type: 'FeatureCollection',
      features: featuresData.map((coord) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [coord[1], coord[0]] },
      })),
    };

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: geojson,
      });
    } else {
      map.getSource(sourceId).setData(geojson);
    }

    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: 'heatmap',
        source: sourceId,
        maxzoom: 15,
        paint: paintOverride(paintOverrides),
      });
    } else {
      map.setLayoutProperty(layerId, 'visibility', 'visible');
    }
  };

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  const clearHeatMapLayer = (layerId, sourceId) => {
    if (!map) return;
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  };

  const removeAllHeatmaps = () => {
    clearHeatMapLayer(pickupHeatLayerId, pickupSourceId);
    clearHeatMapLayer(dropoffHeatLayerId, dropoffSourceId);
  };

  useEffect(() => {
    if (!map) return;

    if (markersData.length > 0 && markersData.length < THRESHOLD) {
      removeAllHeatmaps();
      addMarkers(markersData);
    } else {
      clearMarkers();
      addOrUpdateHeatmapLayer(
        pickupHeatmapData,
        pickupSourceId,
        pickupHeatLayerId,
        pickupHeatmapPaint
      );
      addOrUpdateHeatmapLayer(
        dropoffHeatmapData,
        dropoffSourceId,
        dropoffHeatLayerId,
        dropoffHeatmapPaint
      );
    }
  }, [markersData, pickupHeatmapData, dropoffHeatmapData, map, THRESHOLD]);

  return null;
};

TaxisVisGeoSpatialManager.propTypes = {
  queries: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      pickupRegion: PropTypes.object,
      dropoffRegion: PropTypes.object,
      lineCoordinates: PropTypes.array,
      buffer: PropTypes.number,
      fromDate: PropTypes.string,
      toDate: PropTypes.string,
    })
  ).isRequired,
  onFilteredTrips: PropTypes.func.isRequired,
  limit: PropTypes.number,
  map: PropTypes.object,
};

export default TaxisVisGeoSpatialManager;
