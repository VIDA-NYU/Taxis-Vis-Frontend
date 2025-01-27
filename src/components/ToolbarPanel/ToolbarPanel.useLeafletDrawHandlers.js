import {useState, useEffect} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

export function useLeafletDrawHandlers({
                                           map,
                                           drawnItemsRef,
                                           onCreate,
                                           onUpdate,
                                           onDelete,
                                           setActiveButton,
                                           defaultPickupColor = "blue",
                                           defaultDropoffColor = "red",
                                           defaultDirectionalColor = "green",
                                       }) {
    const [drawingMode, setDrawingMode] = useState(null);
    const [editHandler, setEditHandler] = useState(null);
    const [deleteHandler, setDeleteHandler] = useState(null);

    useEffect(() => {
        if (!map) return;
        map.addLayer(drawnItemsRef.current);

        const handleDrawCreated = (e) => {
            const layer = e.layer;
            layer.options.type = drawingMode || "custom";
            drawnItemsRef.current.addLayer(layer);
            onCreate?.({
                type: drawingMode || "custom",
                feature: layer.toGeoJSON(),
            });

            setActiveButton(null);
        };

        map.on(L.Draw.Event.CREATED, handleDrawCreated);

        return () => {
            map.off(L.Draw.Event.CREATED, handleDrawCreated);
        };
    }, [map, drawingMode, onCreate, drawnItemsRef, setActiveButton]);

    const activateDrawing = (mode) => {
        setDrawingMode(mode);
        if (!map) return;

        let color = defaultDirectionalColor;
        if (mode === "pickup") color = defaultPickupColor;
        if (mode === "dropoff") color = defaultDropoffColor;

        const options = {shapeOptions: {color}};
        const drawHandler =
            mode === "pickup" || mode === "dropoff"
                ? new L.Draw.Polygon(map, options)
                : new L.Draw.Polyline(map, options);

        drawHandler.enable();

        map.on("draw:created", () => {
            drawHandler.disable();
        });
    };

    const activateEditing = () => {
        if (!map) return;
        if (!editHandler) {
            const handler = new L.EditToolbar.Edit(map, {
                featureGroup: drawnItemsRef.current,
            });
            handler.enable();
            map.on("draw:editstop", () => {
                const updatedFeatures = drawnItemsRef.current.getLayers().map((layer) => ({
                    type: layer.options.type,
                    feature: layer.toGeoJSON(),
                }));
                onUpdate?.(updatedFeatures);
            });
            setEditHandler(handler);
        } else {
            editHandler.disable();
            setEditHandler(null);
        }
    };

    const activateDeleting = () => {
        if (!map) return;
        if (!deleteHandler) {
            const handler = new L.EditToolbar.Delete(map, {
                featureGroup: drawnItemsRef.current,
            });
            handler.enable();
            map.on("draw:deletestop", () => {
                const remainingFeatures = drawnItemsRef.current.getLayers().map((layer) => ({
                    type: layer.options.type,
                    feature: layer.toGeoJSON(),
                }));
                onDelete?.(remainingFeatures);
            });
            setDeleteHandler(handler);
        } else {
            deleteHandler.disable();
            setDeleteHandler(null);
        }
    };

    return {
        drawingMode,
        setDrawingMode,
        activateDrawing,
        activateEditing,
        activateDeleting,
        editHandler,
        deleteHandler,
    };
}
