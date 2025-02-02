<div align="center">
  <img src="./public/repo_icon.png" alt="Taxis Vis Icon" width="150"/>
  <h1><strong>Taxis Vis</strong></h1>
  <h4>Frontend-side 🎨</h4>

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Mapbox GL JS](https://img.shields.io/badge/Mapbox%20GL%20JS-3BB3E4?style=for-the-badge&logo=mapbox&logoColor=white)
![Plotly.js](https://img.shields.io/badge/Plotly.js-3F4F75?style=for-the-badge&logo=plotly&logoColor=white)
![Version](https://img.shields.io/badge/Version-0.3.0_alpha-red?style=for-the-badge)
</div>

______

<div align="center">

_Greetings_ from the **Taxis Vis Frontend**! This project is a component of the larger **Taxis Vis** initiative, which
draws inspiration from the paper [*Visual Exploration of Big Spatio-Temporal Urban Data: A Study of New York City Taxi
Trips*](https://ieeexplore.ieee.org/abstract/document/6634127/).
We aim to _revive_ the paper using _modern_ open-source tools.

</div>

<div align="center">
  <img src="./public/readme_main_cover.png" alt="Taxis Vis Main Cover"/>
</div>

## 📣 **Latest News**

> [!IMPORTANT]
> ### **Latest News**
> - _[0.3.0]_ **🗺️ Migration to Mapbox from Leaflet**: We have finally migrated from **Leaflet** to **Mapbox GL JS** for
    enhanced map performance, interactivity, and styling options.  
    While Mapbox now requires an API access token, it remains largely **free** for projects like **Taxis Vis**, where
    the expected usage is well within the **50,000 free map loads per month**.  
    We do not utilise any other premium Mapbox services beyond tile serving, making this transition seamless for
    users.  
    Make sure to configure your `.env` file with a valid **Mapbox API token** (see the setup instructions below).
> - **🎉 DC & NYC Examples**: We've added detailed READMEs for integrating Washington DC and NYC taxi data into Taxis
    Vis.  
    > You can find these in the `examples/` directory of this repository.
> - _[0.2.0]_ **🌎 Taxis Vis Exploration Beyond NYC**: You can easily adapt this project for **any** city of interest —
    provided  
    > you have the taxi data and minimal geojson resources. The system's architecture is flexible enough to
    accommodate  
    > various schemas and polygon data with small config changes.
> - _[0.1.0]_ **✅ Proof of Concept**: Reproducing the Taxis-Vis paper is **entirely feasible** with modern tools like  
    React, Mapbox GL JS, DuckDB, Django, and more. We’ve eliminated the high hurdles typically seen in older solutions,
    such  
    as specialized or custom databases.

## 🚀 **Overview**

The `Taxis Vis Frontend` provides geo-spatial insights and interactive visualisations for investigating taxi trip data
(⌗ yes, to any city of interest as long as you have the data that comes with it ⌗ !).

It communicates with:

1. A **GeoSpatial Node.js + DuckDB Backend** – performing spatial & filtering queries.
2. A **Data Analysis Python Django + Pandas Backend** – performing analyses & generating chart data.

While not fully replicating every feature from the paper, this **proof-of-concept** demonstrates the feasibility of
developing a robust, real-time, interactive taxi data exploration tool using _today_ tools without weeks or months of
development time.

---

## ☀️ **Key Features**

- **Spatial Selections** – Draw polygons or lines to define **Pickup** or **Dropoff** regions and query them.
- **Spatial Queries** – Filter trips based on spatial relationships (e.g., union of **Pickup** and **Dropoff** regions,
  **Directional** queries, etc.).
- **Temporal Constraints** – Combine **time ranges** with your spatial queries to refine trip filtering.
- **Data Analysis** – Generate histograms, box plots, scatter plots, and other charts from the filtered data.

---

## 🎛️ **Configuration Management**

<details>
<summary> 👀 Curious how to deal with your own city of interest, taxi trips data of interest ? Click here to expand! ➡️ </summary>

### **A. `mapConfig.json` for Map Setup and Layers**

The **Frontend** relies on `public/config/mapConfig.json` to configure:

1. **Map Defaults** (tile layer, center coordinates, zoom level, etc.)
2. **GeoJSON Layers** – the static geojson polygons/lines you want to display (e.g., city boundaries, boroughs,
   neighborhoods, etc.)

**Example**:

```json
{
  "mapSettings": {
    "tileLayer": "outdoors-v12-2D",
    "center": "nyc",
    "threeDEnabled": false,
    "zoom": 11
  },
  "geoJsonLayers": [
    {
      "id": "nyc-layer",
      "name": "NYCBoroughs",
      "url": "/geojson/NYC/boroughs.geojson",
      "style": {
        "color": "#4E3FC8",
        "weight": 2,
        "opacity": 0.5
      }
    }
  ]
}
```

- **`mapSettings`**: Contains your default map center, zoom and threeD settings.
- **`geoJsonLayers`**: Each layer has an `id`, a `name`, a `url` path to the `.geojson` file, and an optional `style`.

> [!NOTE]
> - You can serve multiple **geoJSON layers** by adding them to the `"geoJsonLayers"` array.
> - The **UI** can toggle layers **on/off** dynamically.
> - **To enable 3D buildings**, add `"threeDEnabled": true` inside `"mapSettings"`.
> - The 3D layer automatically overlays the city’s **vector buildings layer** when zoomed in.

### **B. Adding a New City or Additional Layers**

1. **Copy** or place a new GeoJSON file in `public/geojson/<CityName>/<fileName>.geojson`.
2. **Edit** `public/config/mapConfig.json` to add your new layer under `geoJsonLayers` with the correct relative path in
   `url`.
3. **Adjust** the map `center` and `zoom` in `mapSettings` if you want your new city to be the default view.

### **Data Flow** (High-Level)

1. **User Draws** a polygon on the map → This triggers an internal "features" state update in React.
2. **Frontend** sends these “features” + time constraints to the **Geospatial Node.js Backend** at
   `http://<host>:4000/api/trips/query`.
3. **Geospatial Backend** returns the filtered trip data → The **Frontend** either displays them as markers or a
   heatmap.
4. **User** triggers a chart (e.g., “Trip Duration Histogram”) → The **Frontend** sends a CSV of the filtered trips to
   the **Data Analysis Django Backend** at `http://<host>:8000/api/visualisation/<analysis-endpoint>`.
5. **Django Backend** returns chart JSON → The **Frontend** uses Plotly to render the chart.

### **C. Backend Configuration**

We recommend checking the **GeoSpatial Node.js Backend** and **Data Analysis Django Backend** READMEs
for their respective configurations.

</details>

---

## 📦 **Installation**

### **Pre-requisites**

- **Node.js** installed on your system.
- **npm** or **yarn** package manager installed.
- **(Required)** Backends running for full functionality:
    - [GeoSpatial Node.js Backend](https://github.com/VIDA-NYU/Taxis-Vis-Geospatial-Backend)
    - [Data Analysis Django Backend](https://github.com/VIDA-NYU/Taxis-Vis-Data-Backend)

### **Setup**

1. **Clone** this repository:
   ```bash
   git clone https://github.com/VIDA-NYU/Taxis-Vis-Frontend.git
   cd Taxis-Vis-Frontend
   ```
2. **Install** dependencies:
   ```bash
   npm install
   ```
3. **Create a `.env` file and configure Mapbox access**:
    - You need a **Mapbox API token** to use this project. If you don’t have one, sign up
      at [Mapbox](https://account.mapbox.com/access-tokens/) to generate an access token.
    - Inside the project root, create a `.env` file:
      ```bash
      touch .env
      ```
    - Open the `.env` file and add:
      ```plaintext
      REACT_APP_MAPBOX_TOKEN=your-mapbox-access-token-here
      ```
    - Replace `your-mapbox-access-token-here` with your actual Mapbox token. See
      further  [Mapbox Access Token](https://docs.mapbox.com/help/getting-started/access-tokens/).

4. **Start** the development server:
   ```bash
   npm start
   ```
5. **Open** `http://localhost:3000` in your browser.

> [!NOTE]
> If you need to point to different backend URLs, see `src/config/apiUrls.js` or adjust your environment variables. By
> default, it expects the Node.js backend on `localhost:4000` and the Django backend on `localhost:8000`.

### 🎛️ **Configuration Management Example**

<details>
<summary> Let's follow up with the Config. management tutorial above, yet with a proper ex. ➡️ </summary>

## 💡 **Example Workflow**: Adding a `taxis_london.duckdb` Dataset

1. **Place** a new GeoJSON (e.g., `london_neighborhoods.geojson`) in `public/geojson/London`.
2. **Create** a new `mapConfig.json` (or modify the existing one) with:
   ```json
   {
     "mapSettings": {
       "tileLayer": "outdoors-v12-2D",
       "center": "london",
       "threeDEnabled": false,
       "zoom": 11
     },
     "geoJsonLayers": [
       {
         "id": "london-neighborhoods",
         "name": "London Neighborhoods",
         "url": "/geojson/London/london_neighborhoods.geojson",
         "style": {
           "color": "#BADA55",
           "weight": 2,
           "opacity": 0.5
         }
       }
     ]
   }
   ```
3. **Backend** side: create or modify the `config.json` in the Node.js geospatial backend to point to
   `taxis_london.duckdb` and set `filePath` to your London neighborhoods GeoJSON. (Refer to the GeoSpatial Node.js
   Backend README.)
4. **Restart** everything. The map now shows the London area and queries the `taxis_london.duckdb` behind the scenes.

</details>

---

## Design Philosophy 💡

We started recreating `Taxis Vis` with the goal of relying on flexible, well-supported open-source tools at every corner
of the project.

Choosing **React**, **Mapbox GL JS**, and **Plotly.js** as our core UI technologies enables us to quickly adapt to new
requirements while ensuring that they are well maintained and actively updated. Similarly, the geospatial computation
side relies on cutting-edge technologies like **DuckDB** and libraries such as **Turf.js**, while our data analysis side
leverages **Python**, **Django**, and **Pandas**. This combination allows us to reproduce substantial paper concepts
without significant overhead, and in a shorter timeframe.

This philosophy empowers us to create reusable, maintainable libraries of urban-based code that can be easily repurposed
and extended for future research and industry projects.

---

## Limitations 🚧

| **Limitation**            | **Details**                                                                                                                                          |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Backend Dependency**    | Most features rely on the Node.js + DuckDB backend (for spatial queries) and Django (for analytics). Without them, you only see the base map and UI. |
| **Large Data**            | Extremely large datasets may degrade performance in the browser.                                                                                     |
| **Cross-Browser Testing** | Primarily tested on modern browsers (Chrome, Safari, etc.). Older browsers might require polyfills.                                                  |
| **Other Map Management**  | The current version uses Mapbox GL JS. If you would like to use another map library, it will require reworking the toolbar drawing tools.            |

---

# **🎉 Adding Washington DC & NYC Examples**

We now have two example READMEs illustrating how to integrate DC or NYC taxi data into Taxis Vis:

1. **[DC Example](./examples/DC/example.md)** – Shows how to import Washington DC taxi data, create a DuckDB database,
   and configure the frontend and backend.
2. **[NYC Example](./examples/NYC/example.md)** – Demonstrates importing NYC taxi data, sampling large CSV files, and
   setting up multiple GeoJSON layers (boroughs, neighborhoods, parks).

These examples are located in the `examples/` directory. They serve as a step-by-step reference if you're configuring
Taxis Vis for a new city or wish to see how we handle data conversion, DuckDB creation, and geojson layering.

> [!TIP]
> **Try them out**:
> 1. **Clone** the project.
> 2. Follow the **DC** or **NYC** instructions (or adapt them for your city).
> 3. Enjoy your newly integrated taxi trip dataset! 🎉

---

## 📖 **Further Reading**

- [GeoSpatial Node.js Backend README](https://github.com/VIDA-NYU/Taxis-Vis-Geospatial-Backend)
- [Data Analysis Django Backend README](https://github.com/VIDA-NYU/Taxis-Vis-Data-Backend)
- [The Original Paper (IEEE)](https://ieeexplore.ieee.org/abstract/document/6634127/)

---

**Happy Exploring!**  
_The Taxis Vis Team_
