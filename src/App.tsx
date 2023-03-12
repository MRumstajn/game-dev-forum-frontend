import React from "react";

import { Route, Routes } from "react-router-dom";

import { Home } from "./home/pages/Home";
import { Navbar } from "./navbar/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
