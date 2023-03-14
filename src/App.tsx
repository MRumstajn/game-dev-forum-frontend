import React from "react";

import { IntlProvider } from "@tiller-ds/intl";

import { Route, Routes } from "react-router-dom";

import { Home } from "./home/pages/Home";
import { Navbar } from "./navbar/Navbar";
import { News } from "./news/pages/News";
import { Thread } from "./Thread/pages/Thread";

function App() {
  return (
    <>
      <IntlProvider lang="hr">
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<Thread />} />
        </Routes>
      </IntlProvider>
    </>
  );
}

export default App;
