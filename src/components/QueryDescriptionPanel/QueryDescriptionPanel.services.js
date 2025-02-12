import * as turf from '@turf/turf';
import {
  findIntersectingNeighborhoods,
  findNeighborhoodContainingPoint,
} from './QueryDescriptionPanel.utils';

export const fetchDescriptions = async (queries, geoJsonLayers, config) => {
  if (!queries || queries.length === 0) return [];

  try {
    return await Promise.all(
      queries.map(async (query) => {
        let description = {
          pickupZones: [],
          dropoffZones: [],
          viaZone: null,
          type: '',
        };

        const regionFilters = {};
        if (query.region) {
          regionFilters.region = query.region;
        }
        if (query.pickupRegion && query.dropoffRegion) {
          regionFilters.pickupRegion = query.pickupRegion;
          regionFilters.dropoffRegion = query.dropoffRegion;
        }

        switch (query.type) {
          case 'pickup': {
            description.pickupZones = findIntersectingNeighborhoods(
              regionFilters.region,
              geoJsonLayers,
              config
            );
            description.type = 'Pickup Zone(s)';
            break;
          }
          case 'dropoff': {
            description.dropoffZones = findIntersectingNeighborhoods(
              regionFilters.region,
              geoJsonLayers,
              config
            );
            description.type = 'Dropoff Zone(s)';
            break;
          }
          case 'pickup-dropoff': {
            description.pickupZones = findIntersectingNeighborhoods(
              regionFilters.pickupRegion,
              geoJsonLayers,
              config
            );
            description.dropoffZones = findIntersectingNeighborhoods(
              regionFilters.dropoffRegion,
              geoJsonLayers,
              config
            );
            description.type = 'Pickup to Dropoff';
            break;
          }
          case 'directional': {
            if (
              !query.lineCoordinates ||
              !query.pickupRegion ||
              !query.dropoffRegion
            ) {
              console.warn('Incomplete directional query.');
              break;
            }

            if (query.lineCoordinates.length < 2) {
              console.warn('Not enough lineCoordinates for directional query.');
              break;
            }

            const lineMidpoint = turf.midpoint(
              turf.point(query.lineCoordinates[0]),
              turf.point(query.lineCoordinates[1])
            );

            description.pickupZones = findIntersectingNeighborhoods(
              regionFilters.pickupRegion,
              geoJsonLayers,
              config
            );
            description.dropoffZones = findIntersectingNeighborhoods(
              regionFilters.dropoffRegion,
              geoJsonLayers,
              config
            );
            description.viaZone = findNeighborhoodContainingPoint(
              lineMidpoint.geometry.coordinates,
              geoJsonLayers,
              config
            );
            description.type = 'Directional';
            break;
          }
          default: {
            console.warn(`Unknown query type: ${query.type}`);
          }
        }

        return description;
      })
    );
  } catch (error) {
    console.error('Error fetching descriptions:', error);
    return [];
  }
};
