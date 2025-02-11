import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Explore from "./screens/Explore/Explore";
import HomePage from "./screens/HomePage/HomePage";
import {DuckDBProvider} from "./providers/DuckDB/DuckDBProvider";

const App = () => {
    return (
        <DuckDBProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/explore" element={<Explore/>}/>
                </Routes>
            </Router>
        </DuckDBProvider>
    );
};

export default App;
