function createPickupMarkerEl() {
    const circle = document.createElement("div");
    circle.style.boxSizing = "border-box";
    circle.style.width = "16px";
    circle.style.height = "16px";
    circle.style.borderRadius = "50%";
    circle.style.border = "4px solid rgba(255, 255, 255, 0.7)";
    circle.style.backgroundColor = "#3B82F6";
    return circle;
}

function createDropoffMarkerEl() {
    const circle = document.createElement("div");
    circle.style.boxSizing = "border-box";
    circle.style.width = "16px";
    circle.style.height = "16px";
    circle.style.borderRadius = "50%";
    circle.style.border = "4px solid rgba(255, 255, 255, 0.7)";
    circle.style.backgroundColor = "#DC2626";
    return circle;
}

const pickupHeatmapPaint = {
    "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0,
        "rgba(33,102,172,0)",
        0.2,
        "rgb(103,169,207)",
        0.4,
        "rgb(209,229,240)",
        0.6,
        "rgb(253,219,199)",
        0.8,
        "rgb(239,138,98)",
        1,
        "rgb(178,24,43)",
    ],
};
const dropoffHeatmapPaint = {
    "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0,
        "rgba(255,140,0,0)",
        0.2,
        "rgb(255,180,0)",
        0.4,
        "rgb(255,200,100)",
        0.6,
        "rgb(255,215,140)",
        0.8,
        "rgb(255,160,100)",
        1,
        "rgb(255,80,0)",
    ],
};

export {createPickupMarkerEl, createDropoffMarkerEl, pickupHeatmapPaint, dropoffHeatmapPaint};
