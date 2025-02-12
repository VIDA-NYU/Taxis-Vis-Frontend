import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const PickupMode = Object.assign({}, MapboxDraw.modes.draw_polygon, {
  onStop(state) {
    const feature = this.getFeature(state.polygon.id);
    if (feature) {
      feature.properties = feature.properties || {};
      feature.properties.mode = 'pickup';
    }
    return MapboxDraw.modes.draw_polygon.onStop.call(this, state);
  },
});

const DropoffMode = Object.assign({}, MapboxDraw.modes.draw_polygon, {
  onStop(state) {
    const feature = this.getFeature(state.polygon.id);
    if (feature) {
      feature.properties = feature.properties || {};
      feature.properties.mode = 'dropoff';
    }
    return MapboxDraw.modes.draw_polygon.onStop.call(this, state);
  },
});

const DirectionalMode = Object.assign({}, MapboxDraw.modes.draw_line_string, {
  onStop(state) {
    const feature = this.getFeature(state.line.id);
    if (feature) {
      feature.properties = feature.properties || {};
      feature.properties.mode = 'directional';
    }
    return MapboxDraw.modes.draw_line_string.onStop.call(this, state);
  },
});

export { PickupMode, DropoffMode, DirectionalMode };
