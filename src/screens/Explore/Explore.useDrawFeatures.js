import {useState, useCallback} from "react";
import {consolidateQueries} from "./Explore.queries";

export default function useDrawFeatures(bufferDistance, dateRange, setDateRange) {
    const [features, setFeatures] = useState({
        pickup: [],
        dropoff: [],
        directional: []
    });
    const [queries, setQueries] = useState([]);

    const updateFeaturesAndQueries = useCallback((updatedFeatures) => {
        setFeatures(updatedFeatures);
        setQueries(consolidateQueries(updatedFeatures, bufferDistance, dateRange));
    }, [bufferDistance, dateRange]);

    const handleCreate = useCallback(({type, feature}) => {
        setFeatures(prevFeatures => {
            const updated = {
                ...prevFeatures,
                [type]: [...(prevFeatures[type] || []), feature]
            };
            setQueries(consolidateQueries(updated, bufferDistance, dateRange));
            return updated;
        });
    }, [bufferDistance, dateRange]);

    const handleUpdate = useCallback((updatedFeatures) => {
        setFeatures(prevFeatures => {
            const newFeatures = {
                pickup: [...prevFeatures.pickup],
                dropoff: [...prevFeatures.dropoff],
                directional: [...prevFeatures.directional]
            };
            updatedFeatures.forEach(({type, feature}) => {
                const index = newFeatures[type].findIndex(f => f.id === feature.id);
                if (index >= 0) {
                    newFeatures[type][index] = feature;
                } else {
                    newFeatures[type].push(feature);
                }
            });
            setQueries(consolidateQueries(newFeatures, bufferDistance, dateRange));
            return newFeatures;
        });
    }, [bufferDistance, dateRange]);

    const handleDelete = useCallback((remainingFeatures) => {
        const grouped = {pickup: [], dropoff: [], directional: []};
        remainingFeatures.forEach(({type, feature}) => {
            grouped[type].push(feature);
        });
        updateFeaturesAndQueries(grouped);
    }, [updateFeaturesAndQueries]);

    const handleDateRangeChange = useCallback((newRange) => {
        const formatted = {
            start: newRange.start ? newRange.start.toDate().toISOString() : null,
            end: newRange.end ? newRange.end.toDate().toISOString() : null,
        };
        setDateRange(formatted);
        setQueries(consolidateQueries(features, bufferDistance, formatted));
    }, [features, bufferDistance]);

    return {
        features,
        queries,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleDateRangeChange
    };
}
