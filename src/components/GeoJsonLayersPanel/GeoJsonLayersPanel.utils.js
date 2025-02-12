export const add3DBuildingsLayer = (map) => {
  if (!map) return;

  const insert3DBuildingsLayer = () => {
    if (map.getLayer('3d-buildings-layer')) {
      return;
    }

    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
      (l) => l.type === 'symbol' && l.layout?.['text-field']
    )?.id;

    map.addLayer(
      {
        id: '3d-buildings-layer',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height'],
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height'],
          ],
          'fill-extrusion-opacity': 0.6,
        },
      },
      labelLayerId
    );
  };

  if (map.isStyleLoaded()) {
    insert3DBuildingsLayer();
  } else {
    map.on('load', insert3DBuildingsLayer);
  }
};

export const toggle3DBuildingsVisibility = (map) => {
  if (!map.getLayer('3d-buildings-layer')) {
    console.warn(
      '3D Buildings layer is not yet loaded, cannot toggle visibility.'
    );
    return;
  }
  const currentVisibility = map.getLayoutProperty(
    '3d-buildings-layer',
    'visibility'
  );
  const newVisibility = currentVisibility === 'visible' ? 'none' : 'visible';
  map.setLayoutProperty('3d-buildings-layer', 'visibility', newVisibility);
  return newVisibility === 'visible';
};
