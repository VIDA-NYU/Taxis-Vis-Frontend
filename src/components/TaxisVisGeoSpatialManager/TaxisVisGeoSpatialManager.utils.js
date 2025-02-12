import { maybeQuoteIdentifier } from '../../utils/helper';

function createPickupMarkerEl() {
  const circle = document.createElement('div');
  circle.style.boxSizing = 'border-box';
  circle.style.width = '16px';
  circle.style.height = '16px';
  circle.style.borderRadius = '50%';
  circle.style.border = '4px solid rgba(255, 255, 255, 0.7)';
  circle.style.backgroundColor = '#3B82F6';
  return circle;
}

function createDropoffMarkerEl() {
  const circle = document.createElement('div');
  circle.style.boxSizing = 'border-box';
  circle.style.width = '16px';
  circle.style.height = '16px';
  circle.style.borderRadius = '50%';
  circle.style.border = '4px solid rgba(255, 255, 255, 0.7)';
  circle.style.backgroundColor = '#DC2626';
  return circle;
}

const pickupHeatmapPaint = {
  'heatmap-color': [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    'rgba(33,102,172,0)',
    0.2,
    'rgb(103,169,207)',
    0.4,
    'rgb(209,229,240)',
    0.6,
    'rgb(253,219,199)',
    0.8,
    'rgb(239,138,98)',
    1,
    'rgb(178,24,43)',
  ],
};
const dropoffHeatmapPaint = {
  'heatmap-color': [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    'rgba(255,140,0,0)',
    0.2,
    'rgb(255,180,0)',
    0.4,
    'rgb(255,200,100)',
    0.6,
    'rgb(255,215,140)',
    0.8,
    'rgb(255,160,100)',
    1,
    'rgb(255,80,0)',
  ],
};

const transformQueryResults = (rows, config) => {
  const reverseMapping =
    config && config.logical_db_to_required_columns
      ? Object.fromEntries(
          Object.entries(config.logical_db_to_required_columns).map(
            ([logicalKey, requiredColumn]) => [requiredColumn, logicalKey]
          )
        )
      : {};

  return rows.map((row) => {
    const transformedRow = {};
    for (const [dbColumnName, value] of Object.entries(row)) {
      const key = reverseMapping[dbColumnName] || dbColumnName;

      if (key === 'pickup' || key === 'dropoff') {
        try {
          transformedRow[key] =
            typeof value === 'string' && value.startsWith('{')
              ? JSON.parse(value)
              : value;
        } catch (error) {
          console.error(`Invalid JSON in ${key}:`, value);
          transformedRow[key] = null;
        }
      } else if (typeof value === 'bigint') {
        transformedRow[key] = value.toString();
      } else if (value?.constructor?.name === 'DuckDBTimestampValue') {
        transformedRow[key] = new Date(
          Number(value.micros / 1000n)
        ).toISOString();
      } else {
        transformedRow[key] = value;
      }
    }
    return transformedRow;
  });
};

const buildDateFilter = (fromDate, toDate, config) => {
  let filter = '';
  if (fromDate)
    filter += `AND ${config.datetimeColumns.pickup} >= '${fromDate}' `;
  if (toDate) filter += `AND ${config.datetimeColumns.dropoff} <= '${toDate}' `;
  return filter;
};

const constructQuery = (type, regionFilters, dateFilter, limit, config) => {
  const quotedTable = maybeQuoteIdentifier(config.tableName);
  const pickupCol = config.locationColumns.pickup;
  const dropoffCol = config.locationColumns.dropoff;

  const selectClause = `
        SELECT *                                                  EXCLUDE (${pickupCol}, ${dropoffCol}), ST_AsGeoJSON(ST_GeomFromGeoJSON(${pickupCol})) AS ${pickupCol},
               ST_AsGeoJSON(ST_GeomFromGeoJSON(${dropoffCol})) AS ${dropoffCol}
        FROM ${quotedTable}
    `;

  const region = JSON.stringify(regionFilters.region);
  const pickupRegion = JSON.stringify(regionFilters.pickupRegion);
  const dropoffRegion = JSON.stringify(regionFilters.dropoffRegion);
  const bufferedLine = regionFilters.bufferedLine
    ? JSON.stringify(regionFilters.bufferedLine.geometry)
    : null;

  switch (type) {
    case 'pickup':
      return `
        ${selectClause}
        WHERE ST_Within(
          ST_GeomFromGeoJSON("${pickupCol}"),
          ST_GeomFromGeoJSON('${region}')
        )
        ${dateFilter}
        LIMIT ${limit}
      `;

    case 'dropoff':
      return `
        ${selectClause}
        WHERE ST_Within(
          ST_GeomFromGeoJSON("${dropoffCol}"),
          ST_GeomFromGeoJSON('${region}')
        )
        ${dateFilter}
        LIMIT ${limit}
      `;

    case 'pickup-dropoff':
      return `
        ${selectClause}
        WHERE ST_Within(
          ST_GeomFromGeoJSON("${pickupCol}"),
          ST_GeomFromGeoJSON('${pickupRegion}')
        )
        AND ST_Within(
          ST_GeomFromGeoJSON("${dropoffCol}"),
          ST_GeomFromGeoJSON('${dropoffRegion}')
        )
        ${dateFilter}
        LIMIT ${limit}
      `;

    case 'directional':
      return `
        ${selectClause}
        WHERE ST_Within(
          ST_GeomFromGeoJSON("${pickupCol}"),
          ST_GeomFromGeoJSON('${pickupRegion}')
        )
        AND (
          ST_Within(
            ST_GeomFromGeoJSON("${dropoffCol}"),
            ST_GeomFromGeoJSON('${dropoffRegion}')
          )
          OR ST_Within(
            ST_GeomFromGeoJSON("${dropoffCol}"),
            ST_GeomFromGeoJSON('${bufferedLine}')
          )
        )
        ${dateFilter}
        LIMIT ${limit}
      `;

    default:
      throw new Error(`Unknown query type: ${type}`);
  }
};

const paintOverride = (paintOverrides) => {
  return {
    'heatmap-weight': ['interpolate', ['linear'], ['zoom'], 0, 0.6, 15, 1],
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 15, 3],
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0,
      2,
      10,
      15,
      15,
      25,
    ],
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 10, 0.8, 15, 0.8],
    ...paintOverrides,
  };
};

export {
  createPickupMarkerEl,
  createDropoffMarkerEl,
  pickupHeatmapPaint,
  dropoffHeatmapPaint,
  transformQueryResults,
  buildDateFilter,
  constructQuery,
  paintOverride,
};
