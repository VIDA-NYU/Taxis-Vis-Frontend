# 🏙️ How to Configure Your Own City in Taxis Vis

This guide will help you **add a new city configuration** to Taxis Vis, and most importantly making sure it is save so
that you can re-use that config, in the config selector at the beginning.

---

## **📂 1. Create a New Configuration Folder**

To set up a new city, **create a folder** inside:

```
/config/taxis_vis_config/
```

For example, if you want to add **San Francisco**, create:

```
/config/taxis_vis_config/SF/
```

> [!IMPORTANT]
> The folder name should be **unique** and will be referenced in `config_list.json`.

---

## **📝 2. Reference the New City in `config_list.json`**

Once you have created your new city folder, update `config_list.json` to **include the new configuration**.

**File to edit:**

```
/config/taxis_vis_config/config_list.json
```

**Example (`config_list.json`)**

```json
{
  "configNames": [
    "NYC",
    "DC",
    "SF" // Add your new city name here
  ]
}
```

> [!IMPORTANT]
> Make sure the **folder name and config name match exactly** (case-sensitive) to avoid errors.

---

## **🗄️ 3. Create the Database Folder and Add a DuckDB File**

Inside your new city folder, create a `database` sub-folder:

```
/config/taxis_vis_config/SF/database/
```

Add your city's **DuckDB database file** here. You can create a new one using any method, as long as it contains taxi
data.

> [!NOTE]
> If you need help creating a DuckDB database, check
> out [HOW-TO-CREATE-DUCK-DB-OUT-OF-CSV.md](HOW-TO-CREATE-DUCK-DB-OUT-OF-CSV.md).

---

## **🌍 4. Create the GeoJSON Layers Folder**

Inside your new city folder, create a `geojson_layers` sub-folder:

```
/config/taxis_vis_config/SF/geojson_layers/
```

Store all **GeoJSON files** relevant to your city here. At **minimum**, there must be **one GeoJSON file** representing
**neighborhoods**.

Example:

```
/config/taxis_vis_config/SF/geojson_layers/neighborhoods.geojson
/config/taxis_vis_config/SF/geojson_layers/boroughs.geojson
/config/taxis_vis_config/SF/geojson_layers/parks.geojson
```

> [!IMPORTANT]
> At least **one file must be about neighborhoods** for the app to function correctly.

> [!TIP]
> If you need a **GeoJSON file for neighborhoods**, check open data portals like [Data.gov](https://www.data.gov/).

---

## **⚙️ 5. Create the `config.json` File**

Now, create a `config.json` inside your new city folder:

```
/config/taxis_vis_config/SF/config.json
```

This file contains all settings for your city, including database path, mapping layers, and spatial data.

### **Example `config.json` for San Francisco:**

```json
{
  "name": "SF", // The name of the city configuration (must match the folder name)

  "dbPath": "/config/taxis_vis_config/SF/database/taxis_sf.duckdb", // Path to the DuckDB database file

  "datetimeColumns": {
    "pickup": "pickup_datetime", // Column in the database storing trip pickup timestamps (need to change the value, the key is what we are relying on)
    "dropoff": "dropoff_datetime" // Column in the database storing trip dropoff timestamps (need to change the value, the key is what we are relying on)
  },

  "locationColumns": {
    "pickup": "pickup_location", // Column storing pickup locations in GeoJSON format (need to change the value, the key is what we are relying on)
    "dropoff": "dropoff_location" // Column storing dropoff locations in GeoJSON format (need to change the value, the key is what we are relying on)
  },

  "tableName": "trips", // Name of the table inside the DuckDB database that contains taxi trip data

  "mapSettings": {
    "tileLayer": "streets-v12-2D", // Map tile layer, should match a key in `tiles_layers.json`
    "threeDEnabled": false, // Enable or disable 3D rendering in the map
    "center": "sf", // City center reference (can be a predefined city in `cities_centers.json`) or simply provide [latitude, longitude]
    "zoom": 11 // Default zoom level when the map loads
  },

  "logical_db_to_required_columns": {
    // The following are for the backend data processing (building plots data). If some are not available / remove or leave it empty quotes.
    "trip_distance": "trip_distance", // Column storing the trip distance (need to change the value, the key is what we are relying on)
    "fare_amount": "fare_amount", // Column storing the fare amount (need to change the value, the key is what we are relying on)
    "payment_type": "payment_type", // Column storing the payment type (cash, card, etc.) (need to change the value, the key is what we are relying on)
    "pickup_datetime": "pickup_datetime", // Column storing the pickup datetime (need to change the value, the key is what we are relying on)
    "dropoff_datetime": "dropoff_datetime" // Column storing the dropoff datetime (need to change the value, the key is what we are relying on)
  },

  "geoJsonLayers": [
    // Note, at least one layer below should be named "neighborhood" for proper functionality. It will be used for the neighborhood query naming.
    {
      "id": "sf-neighborhoods-layer", // Unique identifier for this layer
      "name": "neighborhood", // **Must be named `neighborhood` for proper functionality**
      "url": "/config/taxis_vis_config/SF/geojson_layers/neighborhoods.geojson", // Path to the neighborhood GeoJSON file
      "style": {
        "color": "#8206a9", // Hex color for visualization
        "weight": 2, // Line thickness for the layer
        "opacity": 0.5 // Transparency level
      }
    },
    {
      "id": "sf-parks-layer", // Unique identifier for this additional layer
      "name": "SFParks", // Custom name for visualization
      "url": "/config/taxis_vis_config/SF/geojson_layers/parks.geojson", // Path to parks GeoJSON file
      "style": {
        "color": "#298008", // Green color for parks
        "weight": 2,
        "opacity": 0.5
      }
    }
  ]
}
```

✅ **Key Requirements**:

- The **`"dbPath"`** must correctly point to your **DuckDB database**.
- The **`"geoJsonLayers"`** must contain at least one layer named **`"neighborhood"`**.
- The **`"tileLayer"`** must reference a **valid tile layer** from `/public/utils/tiles_layers.json`.
- The **column names** inside `datetimeColumns`, `locationColumns`, and `logical_db_to_required_columns` must match your
  DuckDB schema.

---

## **🛠️ 6. Restart Taxis Vis to Load the New City**

Once your `config.json` is set up, **restart Taxis Vis** to load your new city.

```bash
npm run dev
```

> [!TIP]
> If the new city **does not appear**, double-check that:
>
> - `config.json` is correctly formatted
> - The **database path** is correct
> - At least **one GeoJSON layer is named `neighborhood`**
> - The city is **listed in `config_list.json`**
> - As well as, that you have restarted `npm run dev`.

---

## **🎯 Additional Tips**

- 🌍 If you want to **change the tile layer**, refer to `/public/utils/tiles_layers.json`.
- 🐤 Need help with **DuckDB**? Read the official [DuckDB Docs](https://duckdb.org/docs/) or check
  out [HOW-TO-CREATE-DUCK-DB-OUT-OF-CSV.md](HOW-TO-CREATE-DUCK-DB-OUT-OF-CSV.md).
- 🚀 Want to enhance queries? Consider **optimising DuckDB indexes**.

---

🎉 **Congratulations!** You can now explore your own city's taxi data using **Taxis Vis**! 🚖

**Happy Exploring!**  
🚖 _The Taxis Vis Team_ 🚖
