import React from "react";

import { IntlProvider } from "@tiller-ds/intl";

import { Route, Routes } from "react-router-dom";

import { About } from "./about/About";
import { AccessDeniedErrorPage } from "./error-page/AccessDeniedErrorPage";
import { InternalErrorPage } from "./error-page/InternalErrorPage";
import { NotFoundErrorPage } from "./error-page/NotFoundErrorPage";
import { Category } from "./forum/pages/Category";
import { Forum } from "./forum/pages/Forum";
import { Home } from "./home/pages/Home";
import { Navbar } from "./navbar/Navbar";
import { News } from "./news/pages/News";
import { Rules } from "./Rules/Rules";
import { Thread } from "./Thread/pages/Thread";

function App() {
  return (
    <>
      <IntlProvider lang="hr">
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:threadId" element={<Thread />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:categoryId" element={<Category />} />
          <Route path="/forum/:categoryId/:threadId" element={<Thread />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/about" element={<About />} />
          <Route path="/404" element={<NotFoundErrorPage />} />
          <Route path="/403" element={<AccessDeniedErrorPage />} />
          <Route path="/500" element={<InternalErrorPage />} />
        </Routes>
      </IntlProvider>
    </>
  );
}

export default App;
