import {useEffect} from "react";

const useMapBoxDrawHandler = ({
                                  draw,
                                  map,
                                  onCreate,
                                  onUpdate,
                                  onDelete,
                                  activeButton,
                                  setActiveButton,
                              }) => {
    useEffect(() => {
        if (!draw || !map) return;

        const handleDrawCreate = (e) => {
            const createdFeature = e.features[0];
            if (
                onCreate &&
                createdFeature &&
                createdFeature.properties &&
                createdFeature.properties.mode
            ) {
                onCreate({
                    type: createdFeature.properties.mode,
                    feature: createdFeature,
                });
            }
            if (activeButton !== null) {
                setActiveButton(null);
            }
        };

        const handleDrawUpdate = (e) => {
            if (onUpdate) {
                const updatedFeatures = e.features.map((feature) => ({
                    type: feature.properties.mode || "unknown",
                    feature,
                }));
                onUpdate(updatedFeatures);
            }
            if (activeButton !== null) {
                setActiveButton(null);
            }
        };

        const handleDrawDelete = (e) => {
            if (onDelete) {
                const remainingFeatures = draw.getAll().features.map((feature) => ({
                    type: feature.properties.mode || "unknown",
                    feature,
                }));
                onDelete(remainingFeatures);
            }
            if (activeButton !== null) {
                setActiveButton(null);
            }
        };
        const handleModeChange = (e) => {
            if (e.mode === "simple_select") {
                setActiveButton(null);
            }
        };

        map.on("draw.create", handleDrawCreate);
        map.on("draw.update", handleDrawUpdate);
        map.on("draw.delete", handleDrawDelete);
        map.on("draw.modechange", handleModeChange);

        return () => {
            map.off("draw.create", handleDrawCreate);
            map.off("draw.update", handleDrawUpdate);
            map.off("draw.delete", handleDrawDelete);
            map.off("draw.modechange", handleModeChange);
        };
    }, [draw, map, onCreate, onUpdate, onDelete, setActiveButton]);
};


export default useMapBoxDrawHandler;
