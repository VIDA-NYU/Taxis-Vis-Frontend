export const fetchGeoJson = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching GeoJSON from ${url}:`, error);
    throw error;
  }
};

export const loadGeoJsonLayers = async (layersConfig = []) => {
  try {
    const layersData = await Promise.all(
      layersConfig.map(async (layer) => ({
        ...layer,
        geojsonData: layer.data ? layer.data : await fetchGeoJson(layer.url),
      }))
    );
    return layersData;
  } catch (error) {
    console.error('Error loading GeoJSON layers:', error);
    return [];
  }
};
