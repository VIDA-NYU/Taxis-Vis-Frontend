import {
  initializeDuckDb,
  getDuckDB,
  insertFile,
  runQuery,
} from 'duckdb-wasm-kit';
import { maybeQuoteIdentifier } from '../../utils/helper';

export const initializeDatabase = async (
  configType,
  selectedConfig,
  setDb,
  setConfig,
  setLoading,
  setError
) => {
  try {
    if (!selectedConfig) {
      throw new Error('No config chosen!');
    }

    setLoading(true);

    if (configType === 'existing') {
      const loadedConfig = selectedConfig.config;
      if (!loadedConfig?.dbPath) {
        throw new Error("Existing config missing 'dbPath'!");
      }

      await initializeDuckDb({
        config: { path: loadedConfig.dbPath },
        debug: false,
      });
      const duckdbInstance = await getDuckDB();
      setDb(duckdbInstance);
      setConfig(loadedConfig);
    } else if (configType === 'new') {
      await initializeDuckDb({ debug: false });
      const duckdbInstance = await getDuckDB();
      setDb(duckdbInstance);

      const file = selectedConfig.file;
      const tableName = selectedConfig.config.tableName || file.name;
      const quotedTable = maybeQuoteIdentifier(tableName);

      setConfig({ ...selectedConfig.config, tableName });

      await insertFile(duckdbInstance, file, tableName);

      if (selectedConfig.config.csvLocationCols) {
        await addGeoJsonColumns(
          duckdbInstance,
          quotedTable,
          selectedConfig.config.csvLocationCols
        );
      }
    }

    setLoading(false);
  } catch (err) {
    setError(err);
    setLoading(false);
    console.error('initializeDatabase error:', err);
  }
};

const addGeoJsonColumns = async (
  duckdbInstance,
  tableName,
  csvLocationCols
) => {
  const { pickupLon, pickupLat, dropoffLon, dropoffLat } = csvLocationCols;

  await runQuery(
    duckdbInstance,
    `ALTER TABLE ${tableName}
            ADD COLUMN pickup JSON;`
  );
  await runQuery(
    duckdbInstance,
    `ALTER TABLE ${tableName}
            ADD COLUMN dropoff JSON;`
  );

  await runQuery(
    duckdbInstance,
    `
            UPDATE ${tableName}
            SET pickup = json_object('type', 'Point', 'coordinates', array[${pickupLon}, ${pickupLat}]),
                dropoff= json_object('type', 'Point', 'coordinates', array[${dropoffLon}, ${dropoffLat}])
        `
  );
};
