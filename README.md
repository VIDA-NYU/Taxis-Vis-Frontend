<div align="center">
  <img src="./public/repo_icon.png" alt="Taxis Vis Icon" width="150"/>
  <h1><strong>Taxis Vis</strong></h1>
  <h4>Frontend-side 🎨</h4>

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)
![Plotly.js](https://img.shields.io/badge/Plotly.js-3F4F75?style=for-the-badge&logo=plotly&logoColor=white)
![Version](https://img.shields.io/badge/Version-0.1.0_alpha-red?style=for-the-badge)
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

## 🚀 **Overview**

With geo-spatial insights and interactive visualisations, the Taxis Vis Frontend is the user
interface for investigating and evaluating taxi trip data while working with the computational-based backend
discussed later. Though it is **proof-of-concept** and by far _does not cover all the features discussed in the paper_,
the following first _alpha_ version is nevertheless important to show that it is _feasible_ without high hurdles.

### 🌍 **GeoSpatial Viz. & Computation**

| **Feature**                       | **Notes**                                                                                    |
|-----------------------------------|----------------------------------------------------------------------------------------------|
| **Spatial Selections**            | Simple **Pickup** &or; **Dropoff** zones using polygon drawings.                             |
| **Spatial Queries (SQ)**          | Combine **Pickup** &and; **Dropoff**, as well as with directional lines using a buffer zone. |
| **SQ &cup; Temporal Constraints** | Apply **time filters** to all types of Spatial Queries (**SQ**).                             |

### 📊 **Data Analysis**

> [!IMPORTANT]
> The following are not taken from the paper. They are simply available to show the capability of the backend to provide
> insights and data analysis. Further development is possible to match the paper's _exact_ features.

| **Feature**                            | **Notes**                                                        |
|----------------------------------------|------------------------------------------------------------------|
| 🕒 **Trip Duration Histogram**         | Visualises the distribution of trip durations.                   |
| 📊 **Peak Hours Bar Chart**            | Highlights the busiest hours of the day.                         |
| 📦 **Fare Distribution Box Plot**      | Displays the range and distribution of fares.                    |
| 🧑‍🤝‍🧑 **Passenger Count Pie Chart** | Breaks down trips by passenger count.                            |
| 💳 **Payment Type Pie Chart**          | Shows the proportions of different payment methods.              |
| 💸 **Tip Amount Analysis**             | Analyses tips provided by passengers.                            |
| 🚗 **Distance-Fare Scatter Plot**      | Explores the relationship between trip distance and fare amount. |
| 📈 **Time Series Line Graph**          | Displays trends over time.                                       |

---

### 🚀 **Technology Stack**

#### **Frontend**

| **Feature**              | **Details**                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Framework**            | React.js _(version: 19.0.0)_ [![GitHub Repo stars](https://img.shields.io/github/stars/facebook/react?style=social)](https://github.com/facebook/react)                                                                                                                                                                                                                                                                                                                |
| **GeoSpatial Mapping**   | Leaflet with React-Leaflet for map (navigation/drawing/interactions) management & smoothness enhancements, comparable to MapLibre for enhanced navigation. <br>- [Leaflet ![GitHub Repo stars](https://img.shields.io/github/stars/Leaflet/Leaflet?style=social)](https://github.com/Leaflet/Leaflet) <br>- [React-Leaflet ![GitHub Repo stars](https://img.shields.io/github/stars/PaulLeCam/react-leaflet?style=social)](https://github.com/PaulLeCam/react-leaflet) |
| **Graph Visualisations** | Plotly.js for dynamic graph visualisations [![GitHub Repo stars](https://img.shields.io/github/stars/plotly/plotly.js?style=social)](https://github.com/plotly/plotly.js)                                                                                                                                                                                                                                                                                              |

---

#### **Backend: GeoSpatial Computation**

| **Feature**                | **Details**                                                                                                                                                                 |
|----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Framework**              | Node.js with V8 Multi-Threaded Engine [![GitHub Repo stars](https://img.shields.io/github/stars/nodejs/node?style=social)](https://github.com/nodejs/node)                  |
| **GeoSpatial Computation** | Turf.js for advanced spatial data processing [![GitHub Repo stars](https://img.shields.io/github/stars/Turfjs/turf?style=social)](https://github.com/Turfjs/turf)           |
| **Database**               | DuckDB for efficient querying and spatial indexing [![GitHub Repo stars](https://img.shields.io/github/stars/duckdb/duckdb?style=social)](https://github.com/duckdb/duckdb) |

---

## 📦 **Installation**

### **Pre-requisites**

- **Node.js** installed on your system.
- **npm** package manager installed.

### **Frontend Setup**

1. Clone the repository.
   ```bash
   git clone https://github.com/VIDA-NYU/Taxis-Vis-Frontend.git
   cd Taxis-Vis-Frontend
   ```
2. Install dependencies.
   ```bash
   npm install
   ```
3. Start the development server.
   ```bash
   npm start
   ```

<details>
<summary>🔗 Backend Dependencies ⏭️ MANDATORY ⏮️ </summary>

### **Pre-requisites**

- **Node.js** installed on your system.
- **npm** package manager installed.

### ⚙️ **Backend Setup**

#### **GeoSpatial Backend**

Read first ➡️ [GeoSpatial Backend](https://github.com/VIDA-NYU/Taxis-Vis-Geospatial-Backend)

1. Install Node.js on your machine.
2. Navigate to the GeoSpatial Backend directory and run:
   ```bash
   npm install
   ```
3. Start the server with:
   ```bash
   node server.js
   ```

#### **Data Analysis Backend**

Read first ➡️ [Data Analysis Backend](https://github.com/VIDA-NYU/Taxis-Vis-Data-Backend)

1. Lock and Sync the backend with the following commands:
   ```bash
   uv lock
   uv sync
   ```

2. Start the server with:
   ```bash
   uv run python manage.py runserver
   ```

</details>

> [!IMPORTANT]
> If you have none of the aforementioned backends, you can still run the frontend yet interactive
> features will not work.

---

## Design Philosophy 💡

The **Taxis Vis** project builds on the Taxis Vis paper's insights with a structured, future-proof approach and modern
technology stack. Our philosophy is based on three main principles:

### **1. Embracing Flexibility and Open Source Tools**

We prefer flexible, open-source tools that can be easily adapted to a wide range of use cases. The tools used in this
project are carefully chosen based on:

- **Community Support**: A large number of GitHub stars.
- **Active Maintenance**: Recent commits to increase chances for long-term viability.
- **Ease of Use**: APIs that are simple, intuitive, and/or heavy on features, allowing for rapid development.

### **2. Combining Tools to Gain Complex Insights**

The paper's capabilities require multiple tools, such as spatial selections, queries, and temporal constraints.
There is no single open-source solution that, to the best of the authors' knowledge, provides all of these capabilities
out of the box.
**Taxis Vis** utilises various technologies to replicate and enhance the paper's functionality.

### **3. Creating Generic and Reusable Components**

This project seeks – in parallel of reproducing the so-chosen paper – to abstract and generalise components for reuse in
the urban research community,
including **@VIDA-NYU**.

Consider the **customisable toolbar**: Leaflet and react-Leaflet provides basic
drawing and spatial querying, but lacks easy access to customisation as well as event handling.
We can think contributing a very lightweight wrapper that would aid the urban analytics community by
developing a reusable, modular toolbar for _spatial selection_ _(and the callbacks associated)_ and queries (and the
callbacks associated) – While such component
relies on Leaflet and react-Leaflet for the core functionality which are widely used and
well-maintained ☀️.

**Scale this to all the other components**, and we have a _powerful_, _flexible_, and _reusable_ set of tools for urban
analytics
research – or even beyond! 👀

### Cheers! 🎉
