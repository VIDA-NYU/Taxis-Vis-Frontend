# 📽️ **Taxis Vis - Feature Demos**

Welcome to the **Taxi Vis** Feature Demonstrations! This markdown file presents a structured overview of the platform's
capabilities,
which include **GeoJSON layer management, Spatial Selections, Query Handling, and Multi-City Exploration**.

Each feature is accompanied by a brief **demo video**, which you can view directly from this README.

Please bear with us as we are out of hands for the video-based compression potential post-process by @Github !

## 🚲 **Use In-Memory CSV**

The following instructions demonstrate how to use an in-memory CSV file with the Taxis Vis platform.
This is a temporary configuration that will not be saved, but can be used in memory without downloading any of our heavy
databases
but rather using your CSV datasets. We use DuckDB in the background to handle the data, creating an in-memory instance
of your csv.

https://github.com/user-attachments/assets/bd6d69ef-e669-417f-b580-d5c0e8560891

---

## 🚀 **Basic Tooling**

### **GeoJSON Layer Manager**

Manage and toggle different **GeoJSON layers** for visualising boundaries, boroughs,
neighborhoods, and other spatial data of interests.

https://github.com/user-attachments/assets/7a030612-04a6-4739-801b-47c2ccfd5342

### **Toolbar Manager**

Interact with the map using **drawing tools**. Draw a `Pickup` Region of Interest (ROI) which
draws a `blue` ROI. Draw a `Dropoff` ROI which draws a `red` ROI. When both are together, they are considered as
a union of both (i.e. Starting in the blue and ending in the red). Draw a `Directional` line which draws a `green` line
indicating that the trip that starts in the blue yet does not end in the red but along the green line should be
considered.

Lastly, the `Calendar picker` filter is used to filter trips based on the time range available per the database.

https://github.com/user-attachments/assets/80b0b9e4-891e-4015-acaf-83af88ad346c

---

## 📍 **Spatial Selections & Queries**

### **Pick-Up Spatial Selection**

Select specific areas for **taxi pick-up analysis** (can also be done for Drop-Off locations similarly).

https://github.com/user-attachments/assets/0c541e77-d6c3-4c80-ab1b-99bcec363e88

### **Pick-Up &cup; Drop-Off Spatial Query**

Query trips based on both **Pick-Up and Drop-Off locations** (can be done bidirectionally).

https://github.com/user-attachments/assets/46a71350-2774-4e4f-90f6-b3d5939bd809

### **Pick-Up &cup; Drop-Off &cup; Directional Query**

Add **directional constraints** to Pick-Up & Drop-Off spatial queries. I.e. if dropped off along the directional line within the buffer user-defined size, records is filtered for analysis.

https://github.com/user-attachments/assets/c7f9a7ea-aa8b-4b00-9f5f-b4821041c06c

### **Pick-Up &cup; Drop-Off with Time Constraints**

Enhance spatial queries with **time-based filtering**.

https://github.com/user-attachments/assets/1cd65057-b121-4bdd-bef6-f2caa3cf1119

–––

## 🎯 **Region Of Interest (ROI) Management**

### **Editing ROI Shape**

Modify the shape of a drawn **Region of Interest (ROI)** on the map.

https://github.com/user-attachments/assets/7126d458-aaa0-4ede-81e1-08766e84c2b5

### **Moving/Draging ROI Shape**

Modify the position of a drawn **Region of Interest (ROI)** on the map.

https://github.com/user-attachments/assets/fa85d56b-06b6-4c38-a7f9-8831cf5253de

### **Removing an ROI**

Delete a selected **Region of Interest** from the map.

https://github.com/user-attachments/assets/21de6e08-f4a7-4717-ad1f-ec55ead63d4e

### **Multi-Select & Remove ROIs**

Select and remove multiple **Regions of Interest** at once.

https://github.com/user-attachments/assets/26992178-ea7e-4246-b511-f34c33f71699

---

## 🌎 **Multi-City Exploration**

### **Exploring Different Cities & Map Tile Layers**

Change between cities and switch **map tile layers**.

https://github.com/user-attachments/assets/1fadb994-8474-43ca-a501-843e0672a2ad

### **Pick-Up Selection in a Different City**

Perform pick-up area selections in a **new city of interest**.

https://github.com/user-attachments/assets/09012811-552c-48f4-b10f-d9334e9ee6e4

### **Pick-Up & Drop-Off Directional Query in a Different City**

Run directional spatial queries in a **city other than NYC**.

https://github.com/user-attachments/assets/cf2c2120-88b6-486b-b3b6-91f486278f8c

---

## 📊 **Data Analysis-Based Focus**

Viz. some plots chart data analysis output.

https://github.com/user-attachments/assets/aba93938-4692-4fdd-b925-9fb95afa7942

## 🎁 **Bonus Features**

### **3D Buildings While Querying**

Leverage **3D buildings visualisation** for an immersive 3D layer-based experience while running queries.

https://github.com/user-attachments/assets/de27e1dc-a8b6-46ca-b725-9ad56e8ad3d0

### **Dynamic Query Description Component**

Get real-time query descriptions as you interact with the map.

https://github.com/user-attachments/assets/f2ba9f22-1205-43d3-8bec-edb0cc4b6221

---

📌 **For more details, check the main [Taxis Vis README](https://github.com/VIDA-NYU/Taxis-Vis-Frontend/tree/main).** 🚀
