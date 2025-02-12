#!/bin/bash

command_exists() {
    command -v "$1" &> /dev/null
}

if ! command_exists pip; then
    echo "⚠️ pip is not installed. Attempting to install..."

    if command_exists python3; then
        python3 -m ensurepip --default-pip
    elif command_exists python; then
        python -m ensurepip --default-pip
    else
        echo "❌ Python is not installed. Please install Python and rerun the script."
        exit 1
    fi
fi

if ! command_exists gdown; then
    echo "Installing gdown..."
    pip install --upgrade pip
    pip install gdown
fi

echo "✅ pip and gdown are installed successfully!"

echo "Downloading NYC Taxi Config Database..."
gdown "https://drive.google.com/uc?id=1eaMIsOabVvYi7M-VWi_6WnZf2n14bXdE" -O taxi_vis_nyc.duckdb

mkdir -p public/config/taxis_vis_config/NYC/database/
mv taxi_vis_nyc.duckdb public/config/taxis_vis_config/NYC/database/

echo "✅ NYC Taxi Config Database downloaded successfully!"

echo "Downloading Washington DC Taxi Config Database..."
gdown "https://drive.google.com/uc?id=15_LWVegB56-uBwH3i0fuKoMHfL84XWuH" -O taxi_vis_dc.duckdb

mkdir -p public/config/taxis_vis_config/DC/database/
mv taxi_vis_dc.duckdb public/config/taxis_vis_config/DC/database/

echo "✅ Washington DC Taxi Config Database downloaded successfully!"

echo "🚀 All configuration databases are downloaded and placed in the appropriate directories!"
