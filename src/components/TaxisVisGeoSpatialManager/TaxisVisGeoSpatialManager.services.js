import {
  buildDateFilter,
  constructQuery,
  transformQueryResults,
} from './TaxisVisGeoSpatialManager.utils';
import * as turf from '@turf/turf';
import { runQuery } from 'duckdb-wasm-kit';

export const fetchData = async (
  db,
  queries,
  onSetMarkersData,
  onSetPickupHeatmapData,
  onSetDropoffHeatmapData,
  onFilteredTrips,
  config,
  limit = 1000
) => {
  try {
    let allTrips = [];
    const markersForAll = [];
    const pickupHeatForAll = [];
    const dropoffHeatForAll = [];

    const queryPromises = queries.map(async (queryObj) => {
      const {
        fromDate,
        toDate,
        type,
        region,
        pickupRegion,
        dropoffRegion,
        lineCoordinates,
        buffer = 500,
      } = queryObj;

      const dateFilter = buildDateFilter(fromDate, toDate, config);
      const regionFilters = {};

      if (region) {
        regionFilters.region = region;
      }

      if (pickupRegion && dropoffRegion) {
        regionFilters.pickupRegion = pickupRegion;
        regionFilters.dropoffRegion = dropoffRegion;
      }

      if (lineCoordinates) {
        regionFilters.bufferedLine = turf.buffer(
          turf.lineString(lineCoordinates),
          buffer,
          { units: 'meters' }
        );
      }

      const sql = constructQuery(
        type,
        regionFilters,
        dateFilter,
        limit,
        config
      );
      const arrowResult = await runQuery(db, sql);
      const rowsAsObjects = arrowResult.toArray().map((row) => row.toJSON());
      const trips = transformQueryResults(rowsAsObjects, config);

      trips.forEach((doc) => {
        if (!doc?.pickup?.coordinates || !doc?.dropoff?.coordinates) return;
        const [pickupLng, pickupLat] = doc.pickup.coordinates;
        const [dropoffLng, dropoffLat] = doc.dropoff.coordinates;
        markersForAll.push({
          position: [pickupLat, pickupLng],
          type: 'pickup',
        });
        markersForAll.push({
          position: [dropoffLat, dropoffLng],
          type: 'dropoff',
        });
        pickupHeatForAll.push([pickupLat, pickupLng]);
        dropoffHeatForAll.push([dropoffLat, dropoffLng]);
      });

      return trips;
    });

    const tripsArray = await Promise.all(queryPromises);
    tripsArray.forEach((trips) => {
      allTrips = allTrips.concat(trips);
    });

    onSetMarkersData(markersForAll);
    onSetPickupHeatmapData(pickupHeatForAll);
    onSetDropoffHeatmapData(dropoffHeatForAll);
    onFilteredTrips(allTrips);
  } catch (err) {
    console.error('DuckDB query error:', err);
  }
};
