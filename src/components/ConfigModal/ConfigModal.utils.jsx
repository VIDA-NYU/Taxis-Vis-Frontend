import { extendTheme } from '@chakra-ui/react';

export const THEME = extendTheme({
  styles: {
    global: {
      'html, body': {
        margin: 0,
        padding: 0,
      },
    },
  },
  colors: {
    brand: {
      50: '#e3f2ff',
      100: '#b3daff',
      200: '#81c2ff',
      300: '#4faaff',
      400: '#1d92ff',
      500: '#0478e6',
      600: '#005caf',
      700: '#004178',
      800: '#002742',
      900: '#000e15',
    },
  },
  components: {
    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: '24px',
          bg: 'rgba(255,255,255,0.95)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(14px)',
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: '14px',
        fontWeight: '500',
      },
    },
  },
});

export const getRandomColor = () =>
  '#' +
  Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');

export const checkFileExists = async (filePath) => {
  try {
    const response = await fetch(filePath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn(`Failed to check file: ${filePath}`, error);
    return false;
  }
};

export const validateConfigStructure = (config) => {
  const requiredAttributes = [
    'name',
    'dbPath',
    'datetimeColumns',
    'locationColumns',
    'tableName',
    'mapSettings',
    'geoJsonLayers',
  ];

  for (const attr of requiredAttributes) {
    if (!(attr in config)) {
      throw new Error(`Missing required config attribute: ${attr}`);
    }
  }

  if (typeof config.dbPath !== 'string') {
    throw new Error('Invalid dbPath: must be a string');
  }
  if (typeof config.datetimeColumns !== 'object') {
    throw new Error('Invalid datetimeColumns: must be an object');
  }
  if (typeof config.locationColumns !== 'object') {
    throw new Error('Invalid locationColumns: must be an object');
  }
  if (typeof config.mapSettings !== 'object') {
    throw new Error('Invalid mapSettings: must be an object');
  }
  if (
    !Array.isArray(config.geoJsonLayers) ||
    config.geoJsonLayers.length === 0
  ) {
    throw new Error('Invalid geoJsonLayers: must be a non-empty array');
  }
};
