<div align="center">
  <img src="./public/repo_icon.png" alt="Taxis Vis Icon" width="150"/>
  <h1><strong>Taxis Vis</strong></h1>
  <h4>Frontend-side 🎨</h4>

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)
![Plotly.js](https://img.shields.io/badge/Plotly.js-3F4F75?style=for-the-badge&logo=plotly&logoColor=white)
![Version](https://img.shields.io/badge/Version-0.2.0_alpha-red?style=for-the-badge)
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

<details>
<summary> 📢 Click here to expand! ➡️ </summary>

- **Taxis Vis Exploration Beyond NYC**: You can easily adapt this project for **any** city of interest—provided you have
  the taxi data and minimal geojson resources. The system's architecture is flexible enough to accommodate various
  schemas and polygon data with only small config changes.
- **Proof of Concept**: Reproducing the Taxis-Vis paper is **entirely feasible** with modern tools like React, Leaflet,
  DuckDB, Django, and more. We’ve eliminated high hurdles typically seen for example by the need of the custom DB within
  the paper, years ago.

</details>

## 🚴 **Future Work & Open Research Questions**

<details>
<summary> 📢 Click here to expand! ➡️ </summary>

**Practice-based Enhancements**

- **Concurrency on the Geospatial Backend**: Explore how DuckDB in read-only mode can handle more parallel queries. (
  Full concurrency in write-mode remains limited by DuckDB’s architecture.)
- **Extended Data Analysis Endpoints**: Implement additional analyses from the original Taxis-Vis paper (and beyond).
- **Advanced Date Picker**: Incorporate hour- and minute-level constraints in the time range filtering.
- **Cloud Hosting & Benchmarking**: Test performance with 100K, 1M, and 10M trip records in real-time environments.

**Research-based Open Questions**

- **Reusability**: Investigate how each component—frontends, backends, libraries—could form a broader ecosystem for
  urban analytics, accessible to both technical and non-technical stakeholders.
- **LLMs for Automation**: Explore how large language models could streamline the entire process—creating new Taxis Vis
  instances for different cities, handling JSON config automatically, or giving step-by-step guidance for each setup.
- **Community & Reusability**: Discuss with Juliana, Claudio, and Joao to understand the real-world value of a
  dedicated, open-source “urban computing” library. Would it speed up future proof-of-concept builds inside NYU VIDA and
  beyond? That's my belief and do not understand why is there yet not a toolkit for it!

</details>

## 🚀 **Overview**

The `Taxis Vis Frontend` provides geo-spatial insights and interactive visualisations for investigating taxi trip data
(⌗ yes, to any city of interest as long as you have the data that comes with it ⌗ !).

It communicates with:

1. A **GeoSpatial Node.js + DuckDB Backend** – performing spatial & filtering queries.
2. A **Data Analysis Python Django + Pandas Backend** – performing analyses & generating chart data.

While not fully replicating every feature from the paper, this **proof-of-concept** demonstrates the feasibility of
developing a robust, real-time, interactive taxi data exploration tool using _today_ tools without weeks or month
of development time.

---

## ☀️ **Key Features**

- **Spatial Selections** – Draw polygons or lines to define **Pickup** or **Dropoff** regions and query them.
- **Spatial Queries** – Filter trips based on spatial relationships (e.g., &cup; of **Pickup** and **Dropoff** regions,*
  *Directional** queries, etc.).
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
    "tileLayer": "cartoLight",
    "center": [
      40.7128,
      -74.0060
    ],
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

- **`mapSettings`**: Contains your default map center & zoom.
- **`geoJsonLayers`**: Each layer has an `id`, a `name`, a `url` path to the `.geojson` file, and an optional `style`.

> [!NOTE]
> You can serve multiple layers by adding them to this array. The `UI` can toggle them `on/off`.

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
3. **Start** the development server:
   ```bash
   npm start
   ```
4. **Open** `http://localhost:3000` in your browser.

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
       "tileLayer": "cartoLight",
       "center": [51.5074, -0.1278],
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
   `taxis_london.duckdb` and set `filePath` to your London neighborhoods GeoJSON. Yet, we highly recommend checking the*
   *GeoSpatial Node.js Backend** README for more details.
4. **Restart** everything. The map now shows the London area and queries the `taxis_london.duckdb` behind the scenes.

</details>

---

## Design Philosophy 💡

We started recreating the `Taxis Vis` with the goal of relying on `flexible`, well-supported `open-source` tools at all
corner of the project.

Choosing `React`, `Leaflet`, and `Plotly` as our core UI-front-end technologies enables us to quickly adapt to new
requirements while ensuring that they are well maintained and actively updated.
Similarly, the `geospatial-computation-side` relies on cutting-edge geo-spatial database management such as `DuckDB` and
heavy-API GeoSpatial computation techniques available via `Turf.JS`, which is also well-maintained and receiving regular
updates.
Hence, by doing so as well on the `data-analysis` side with `Python`, `Django for API` and `Pandas` for tabular-data
management, we benefit from each library's vibrant ecosystem allowing
us to re-create substantial paper concepts without significant barriers and in a shorter (to some extent) time frame.

The whole idea is to thus **learn**, be able to **reproduce** and provide **frameworks** for _future research and
industry projects_ in
this direction as technology evolves fast and the need for such tools (to be maintained and open-source) is growing
exponentially.

Lastly, this philosophy allows us to `create` `reusable`, `maintainable` `libraries` of `urban-based` code that can be
easily repurposed and expanded for future research and industry-based projects.
To end with an example. While `Leaflet`, `MapBox`, `MapLibre`, and others propose methods for drawing polygons on a
displayed map. We were _frustrated_ by the lack of ease of use for customisation.
In the same vein, callback management is well done, but not with ease-of-use accessibility. Hence, our toolbar panel for
`Taxis Vis` enables easy drawing and management of polygons, lines, and callbacks,
with visual customisation options. This is all accomplished by relying on these massive `GIS/NON-GIS`
well-maintained-and-updated libraries; Yet, now
we can reuse this Toolbar on any future project without the hurdle of re-implementing it from scratch.

Scaling this to `N` components, `J` backends, and so on might result in a well-maintained, easily extendable, and
reusable codebase for future _urban-based_ projects, if not an entire new ecosystem! 🌍

---

## Limitations 🚧

| **Limitation**            | **Details**                                                                                                                                                                                                        |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Backend Dependency**    | Most features rely on the Node.js + DuckDB backend (for spatial queries) and Django (for analytics). Without them, you only see the base map and UI.                                                               |
| **Large Data**            | If the returned dataset is extremely large, performance in the browser may degrade.                                                                                                                                |
| **Cross-Browser Testing** | Primarily tested on modern Arc (By The Browser Company on Chromium), Safari, Chrome. Might require polyfills for older browsers or Edge/IE (unverified). Firefox has not yet been tested either.                   |
| **Other Map Management**  | The current vers. uses `Leaflet` for the map. If you would like to use `Mapbox`/`MapLibre` or any other map library, we are happy for a pull request. Yet it will have to rework the entire toolbar drawing tools. |

---

## 📖 **Further Reading**

- [GeoSpatial Node.js Backend README](https://github.com/VIDA-NYU/Taxis-Vis-Geospatial-Backend)
- [Data Analysis Django Backend README](https://github.com/VIDA-NYU/Taxis-Vis-Data-Backend)
- [The Original Paper (IEEE)](https://ieeexplore.ieee.org/abstract/document/6634127/)

---

**Happy Exploring!**  
_The Taxis Vis Team_
