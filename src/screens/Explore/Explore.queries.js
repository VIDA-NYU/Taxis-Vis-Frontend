export const consolidateQueries = (features, bufferDistance, dateRange) => {
    const {pickup, dropoff, directional} = features;
    const result = [];

    if (directional.length > 0 && pickup.length > 0 && dropoff.length > 0) {
        directional.forEach((line) => {
            result.push({
                type: "directional",
                pickupRegion: pickup[0].geometry,
                dropoffRegion: dropoff[0].geometry,
                lineCoordinates: line.geometry.coordinates,
                buffer: bufferDistance,
                fromDate: dateRange.start,
                toDate: dateRange.end,
            });
        });
        return result;
    }
    if (pickup.length > 0 && dropoff.length > 0) {
        result.push({
            type: "pickup-dropoff",
            pickupRegion: pickup[0].geometry,
            dropoffRegion: dropoff[0].geometry,
            fromDate: dateRange.start,
            toDate: dateRange.end,
        });
        return result;
    }
    if (pickup.length > 0) {
        result.push({
            type: "pickup",
            region: pickup[0].geometry,
            fromDate: dateRange.start,
            toDate: dateRange.end,
        });
    }
    if (dropoff.length > 0) {
        result.push({
            type: "dropoff",
            region: dropoff[0].geometry,
            fromDate: dateRange.start,
            toDate: dateRange.end,
        });
    }
    return result;
};
