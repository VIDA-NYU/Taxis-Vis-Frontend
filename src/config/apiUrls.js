const GEOSPATIAL_BACKEND = "http://localhost:4000/api";
const DATA_ANALYSIS_BACKEND = "http://localhost:8000/api";

export const API_URLS = {
    TRIPS: {
        FETCH: `${GEOSPATIAL_BACKEND}/trips/query`,
        DATE_RANGE: `${GEOSPATIAL_BACKEND}/trips/date-range`,
    },
    NEIGHBORHOODS: {
        DESCRIBE: `${GEOSPATIAL_BACKEND}/neighborhoods/describe`,
    },
    CONFIG: `${GEOSPATIAL_BACKEND}/config`,
    VISUALIZATION: `${DATA_ANALYSIS_BACKEND}/visualisation`,
};
