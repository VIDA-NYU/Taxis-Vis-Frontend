import React, {createContext, useContext, useState} from "react";
import {CircularProgress} from "@mui/material";
import {initializeDatabase} from "./DuckDBProvider.services";
import "./DuckDBProvider.styles.css";

export const DuckDBContext = createContext({config: null});
export const useAppConfig = () => {
    const {config} = useContext(DuckDBContext);
    return config;
};

export const DuckDBProvider = ({children}) => {
    const [db, setDb] = useState(null);
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleConfigSelected = async (selectedConfig) => {
        setLoading(true);
        try {
            await initializeDatabase(
                selectedConfig.type,
                selectedConfig,
                setDb,
                setConfig,
                setLoading,
                setError
            );
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DuckDBContext.Provider value={{config, handleConfigSelected}}>
            {error && (
                <div className="duckdb-overlay duckdb-error">
                    <div className="duckdb-error-message">
                        Error: {error.message}
                    </div>
                </div>
            )}
            {loading && (
                <div className="duckdb-overlay">
                    <CircularProgress/>
                </div>
            )}
            {children}
        </DuckDBContext.Provider>
    );
};
