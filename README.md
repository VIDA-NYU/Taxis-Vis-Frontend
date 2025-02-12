<div align="center">
  <img src="public/resources/repo_icon.png" alt="Taxis Vis Icon" width="150"/>
  <h1><strong>Taxis Vis</strong></h1>
  <h4>Frontend-side 🎨</h4>

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Mapbox GL JS](https://img.shields.io/badge/Mapbox%20GL%20JS-3BB3E4?style=for-the-badge&logo=mapbox&logoColor=white)
![Plotly.js](https://img.shields.io/badge/Plotly.js-3F4F75?style=for-the-badge&logo=plotly&logoColor=white)
![DuckDB-WASM](https://img.shields.io/badge/DuckDB--WASM-FFC107?style=for-the-badge&logo=duckdb&logoColor=black)
![Version](https://img.shields.io/badge/Version-0.4.0-red?style=for-the-badge)

</div>

---

> [!WARNING]
> **🚨 Important Notice**:
    This current repository and the Taxis-Vis-Data-Backend are put on hold.
    The goal was to see what is possible to do with today tools on the Javascript end side for 
    reproducing Taxis-VIS. Now it touches enough yet is not deleted because could be (re-)used.
    Cheers! @Simon.
 

<div align="center">

_Greetings_ from the **Taxis Vis Frontend**! This project is a component of the larger **Taxis Vis** initiative, which
draws inspiration from the paper [_Visual Exploration of Big Spatio-Temporal Urban Data: A Study of New York City Taxi
Trips_](https://ieeexplore.ieee.org/abstract/document/6634127/).
We aim to _revive_ the paper using _modern_ open-source tools.

</div>

<div align="center">
  <img src="./public/resources/readme_main_cover.png" alt="Taxis Vis Main Cover"/>
</div>

> [!IMPORTANT]
> **📣 Latest News**
> - _[0.4.0]_ **🚀 DuckDB-WASM Integration & Backend Removal**: We have removed **Taxis-Vis-GeoSpatial Backend** 🎉 and
    replaced it with **DuckDB-WASM**! Thanks to **WebAssembly-powered DuckDB**, we can now perform the same
    **geo-computations directly in the frontend**, making the system more lightweight and efficient. Duck! 🦆✨
>
> - **🚀 Taxis Vis Features Videos Available**: We have added a series of **feature demonstration videos** showcasing
    **GeoJSON layer management, Spatial Selections, Query Handling, and Multi-City Exploration**. You can find them in
    the [FEATURES.md](./FEATURES.md) file of this repository (root).
>
> - _[0.3.0]_ **🗺️ Migration to Mapbox from Leaflet**: We have migrated from **Leaflet** to **Mapbox GL JS** for
    enhanced map performance, interactivity, and styling options. While Mapbox now requires an API access token, it
    remains largely **free** for projects like **Taxis Vis**, where usage stays within **50,000 free map loads per month**. We only use **tile serving**, ensuring a seamless transition. Configure your `.env` with a valid **Mapbox API
    token** (see setup instructions).
>
> - _[0.2.0]_ **🌎 Taxis Vis Exploration Beyond NYC**: Adapt this project for **any** city with available taxi data and
    minimal GeoJSON resources. The system architecture is flexible enough to accommodate various schemas and polygon
    data with minimal config changes.
>
> - _[0.1.0]_ **✅ Proof of Concept**: Reproducing the **Taxis-Vis paper** is entirely feasible with modern tools like
    **React, Leaflet, DuckDB, Django**, and more. We've eliminated the high hurdles of older solutions requiring
    specialised or custom databases.

## 🚀 **Overview**

The `Taxis Vis Frontend` provides geo-spatial insights and interactive visualisations for investigating taxi trip data
(⌗ yes, to any city of interest as long as you have the data that comes with it ⌗ !).

It communicates with:

1. A **DuckDB Web Assembly Module** – performing spatial & filtering queries.
2. A **Data Analysis Python Django + Pandas Backend** – performing analyses & generating chart data.

While not fully replicating every feature from the paper, this **proof-of-concept** demonstrates the feasibility of
developing a robust, real-time, interactive taxi data exploration tool using _today_ tools without weeks or months of
development time.

If you would like to see the current latest version in video examples, please refer to the [FEATURES.md](./FEATURES.md)
file.

---

## ☀️ **Key Features**

- **Spatial Selections** – Draw polygons or lines to define **Pickup** or **Dropoff** regions and query them.
- **Spatial Queries** – Filter trips based on spatial relationships (e.g., union of **Pickup** and **Dropoff** regions,
  **Directional** queries, etc.).
- **Temporal Constraints** – Combine **time ranges** with your spatial queries to refine trip filtering.
- **(Optional) Data Analysis** – Generate histograms, box plots, scatter plots, and other charts from the filtered data.

> [!TIP]
> **🥱 Some Trips & Tricks**:
> - _Understanding the queries' outputs_: Note that most of the time, `blue` dots will represent **Pickup** trips data
    points, while `red` dots will represent **Dropoff** trips data points, regardless of the query.
>
> - Double-clicking when drawing a polygon will automatically close the shape. Thanks `Mapbox Draw`! 🌐

---

## 📦 **Installation**

### **Pre-requisites**

- **Node.js** installed on your system.
- **npm** or **yarn** package manager installed.
- **(Optional)** Backend running for full functionality:
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
     further [Mapbox Access Token](https://docs.mapbox.com/help/getting-started/access-tokens/).

4. **(Optional) Download Current Config Databases (NYC, DC)**:
    - To download the current configuration databases for **New York City** and **Washington DC**, run:
      ```bash
      pip install gdown # Super Cool OSS to use Google Drive API https://github.com/wkentaro/gdown
      gdown "https://drive.google.com/uc?id=1eaMIsOabVvYi7M-VWi_6WnZf2n14bXdE"
      ```
    - This will download the necessary `duckDB` database file for **New York City**. Then, you simply need to drag and
      drop it into the `public/config/taxis_vis_config/NYC/database/` folder || or run:
      ```bash
      mv taxi_vis_nyc.duckdb public/config/taxis_vis_config/NYC/database/
      ```

> [!TIP]  
> 💡 **Quick Setup:** Instead of running the steps manually, you can simply run:
>
> ```bash
> npm run setup:databases # Tested on OSX. Untested on Windows, nor Linux despite being same OSX's core it should be all right.
> ```
>
> This will **automatically download** and place the NYC and DC configuration databases in their respective directories.
> 🚀

> [!NOTE]
> For **Washington DC**, the process is the same, but the link is different:
>
> ```bash
> gdown "https://drive.google.com/uc?id=15_LWVegB56-uBwH3i0fuKoMHfL84XWuH"
> mv taxi_vis_dc.duckdb public/config/taxis_vis_config/DC/database/
> ```

5. **Start** the development server:
   ```bash
   npm run dev # or npm run start
   ```
6. **Open** `http://localhost:3000` in your browser.

7. _(Optional) Configure Your Own City's Config (saved)_:
   We recommend readers to view further in the [HOW-TO-CONFIG-OWN-CITY.md](./HOW-TO-CONFIG-OWN-CITY.md) file for more
   details on how to configure your own city's data while saving the configuration.

> [!NOTE]
> If you need to point to different backend URLs, see `src/utils/apiUrls.js` or adjust your environment variables. By
> default Django backend's on `localhost:8000`.

---

<div align="center">
  <h2>💡 Design Philosophy</h2>
</div>

We started recreating `Taxis Vis` with the goal of relying on flexible, well-supported _semi/open-source_ tools at every
corner of the project.

Carefully selecting **React**, **Mapbox GL JS**, **DuckDB-WASM**, **Turf.js**, and **Plotly.js** as both our core `UI`
and `database` technologies enables us to quickly adapt to new requirements while ensuring that they are well maintained
and actively updated.  
_All_ in one repository, _all_ on the frontend-client side, makes it very sustainable while efficient. Readers should be
noted that this is primarily possible thanks to the **WebAssembly** module of `DuckDB`, as discussed in
[this paper](https://dl.acm.org/doi/abs/10.14778/3554821.3554847).

Similarly, our `data analysis` backend leverages **Python**, **Django**, and **Pandas**. This combination allows us to
reproduce _substantial_ paper concepts without significant overhead, and in a shorter timeframe.
In the long term, it could open the door for `machine learning` to be leveraged in that region of the overall pipeline.

This philosophy therefore empowers us to create `reusable`, `maintainable` libraries of `urban-based` code that can be
easily repurposed and extended for future research and industry projects. As of today,
`Taxis-Vis` Frontend would not be considered a _core_ library at all; rather, it is highly specialised for a
specific [use-case](https://ieeexplore.ieee.org/abstract/document/6634127/).
However, the architecture is designed with future `core` libraries in mind. For this long-term vision, see further
in [OSCUR](https://oscur.org/).

<details>
  <summary><h3>🚧 Limitations</h3></summary>

| **Limitation**            | **Details**                                                                                                                                                                                                                |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Large Data**            | Extremely large datasets may degrade performance in the browser. One limitation known with `DuckDB-WASM` is that you cannot upload files larger than 2GB. [Issue #1705](https://github.com/duckdb/duckdb-wasm/issues/1705) |
| **Cross-Browser Testing** | Primarily tested on modern browsers (Chrome, Safari, Firefox, etc.). Older browsers might require polyfills.                                                                                                               |
| **Other Map Management**  | The current version uses Mapbox GL JS with a Freemium focus. If you would like to use another map library, it will require reworking the toolbar drawing tools.                                                            |

</details>

<details>
  <summary><h3>📖 Further Reading</h3></summary>

- [Data Analysis Django Backend README](https://github.com/VIDA-NYU/Taxis-Vis-Data-Backend)
- [The Original Paper (IEEE)](https://ieeexplore.ieee.org/abstract/document/6634127/)

</details>

**Happy Exploring!**  
_The Taxis Vis Team_
