# 🐥 How to Create a DuckDB Database for Taxis Vis

This guide provides step-by-step instructions on how to create a **DuckDB database** from a taxi trip dataset. DuckDB is
used in **Taxis Vis** for efficient geospatial and analytical queries directly in the frontend.

---

## **📌 Prerequisites**

Before proceeding, ensure you have the following installed:

- [DuckDB](https://duckdb.org/) (CLI)
- [Python 3.9+](https://www.python.org/downloads/)
- `pandas` (for processing CSV files if needed)
- **Your taxi dataset in CSV or Parquet format**

To install the required Python packages:

```bash
pip install pandas
```

> [!IMPORTANT]
> Ensure your dataset is **cleaned** before proceeding. Side effects could not be controlled.

---

## **📂 Step 1: Prepare Your CSV File**

Ensure your dataset is in **comma-separated format (CSV)**. If the data is **pipe-separated (`|`)** or in **Parquet
format**, convert it to CSV.

### **Convert Parquet to CSV**

If your dataset is in **Parquet format**, use this Python script to convert it:

```python
import pandas as pd

def convert_parquet_to_csv(input_file, output_file):
    df = pd.read_parquet(input_file)
    df.to_csv(output_file, index=False)
    print(f'Converted file saved as: {output_file}')

convert_parquet_to_csv("taxi_data.parquet", "taxi_data.csv")
```

> [!NOTE]
> Parquet files are **highly efficient**, yet we should write a dedicated HOW-TO with/for `PARQUET`. Feel free to
> proceed with `PARQUET` if of better interest / provide a HOW-TO as a first contrib.

### **Convert Pipe-Separated CSV to Comma-Separated CSV**

If your dataset uses `|` as a separator, use this Python script to convert it:

```python
import pandas as pd

def convert_pipe_to_comma(input_file, output_file):
    df = pd.read_csv(input_file, sep='|', dtype=str)
    df.to_csv(output_file, index=False, sep=',')
    print(f'Converted file saved as: {output_file}')

convert_pipe_to_comma("taxi_data.txt", "taxi_data.csv")
```

> [!TIP]
> If your dataset is **large**, consider **sampling rows** to improve performance in DuckDB. 1 million rows is fine, 5
> millions is all right but could take time querrying, over that is becoming more complex. Try & Open An Issue.

Now, you have `taxi_data.csv` ready for DuckDB.

---

## **🦆 Step 2: Create a DuckDB Database from CSV**

### **Using DuckDB CLI**

```bash
# Open DuckDB CLI
duckdb
```

### **Create and Import CSV into DuckDB**

Inside the **DuckDB CLI**, run:

```sql
-- Create a new database
.open taxi_data.duckdb

-- Install spatial extension (needed for geospatial queries)
INSTALL spatial;
LOAD spatial;

-- Create a table from CSV
CREATE TABLE trips AS
SELECT * FROM read_csv(
    'taxi_data.csv',
    columns={
        'trip_id': 'INTEGER',
        'pickup_datetime': 'TIMESTAMP',
        'dropoff_datetime': 'TIMESTAMP',
        'trip_distance': 'DOUBLE',
        'pickup_longitude': 'DOUBLE',
        'pickup_latitude': 'DOUBLE',
        'dropoff_longitude': 'DOUBLE',
        'dropoff_latitude': 'DOUBLE',
        'fare_amount': 'DOUBLE',
        'payment_type': 'INTEGER'
    },
    timestampformat='%Y-%m-%d %H:%M:%S'
);

-- Add GeoJSON Point columns
ALTER TABLE trips ADD COLUMN pickup JSON;
ALTER TABLE trips ADD COLUMN dropoff JSON;

UPDATE trips
SET pickup = json('{"type":"Point","coordinates":[' || pickup_longitude || ',' || pickup_latitude || ']}'),
    dropoff = json('{"type":"Point","coordinates":[' || dropoff_longitude || ',' || dropoff_latitude || ']}');

-- Create indexes for faster queries
CREATE INDEX idx_pickup_time ON trips (pickup_datetime);
CREATE INDEX idx_dropoff_time ON trips (dropoff_datetime);

-- Exit DuckDB
.exit
```

> [!TIP]
> Indexing speeds up queries significantly, especially for time-based filters. This is one idea, feel free to optimise
> even further your DB!

🎉 **Your DuckDB database (`taxi_data.duckdb`) is now ready!**

---

## **📌 Step 3: Verify the Database**

To check if the data was successfully imported, reopen DuckDB and run:

```sql
.open taxi_data.duckdb;
SELECT * FROM trips LIMIT 5;
```

This should display sample taxi trip records.

> [!IMPORTANT]
> Always **verify the database** before integrating it with Taxis Vis.

---

## **🌍 Step 4: Move the Database to Taxis Vis**

Now, move your **DuckDB database file** into the correct configuration folder:

```bash
mv taxi_data.duckdb public/config/taxis_vis_config/YOUR_CITY/database/
```

Replace `YOUR_CITY` with your actual city name (e.g., `NYC` or `SF`).

> [!NOTE]
> Ensure the **database path in `config.json` matches** the location of your DuckDB file.

---

## **✅ Final Steps**

1️⃣ **Ensure `config.json` references the correct database path**
2️⃣ **Restart the Taxis Vis frontend**

```bash
npm run dev
```

🎉 Your custom DuckDB database is now integrated into **Taxis Vis**!

---

## **🔗 Additional Resources**

- [DuckDB Official Documentation](https://duckdb.org/docs/)

🚖 **Happy Exploring!**
