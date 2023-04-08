import React from "react";

import { IntlProvider } from "@tiller-ds/intl";

import { Route, Routes } from "react-router-dom";

import { About } from "./about/About";
import { AuthProvider } from "./common/components/AuthProvider";
import { AccessDeniedErrorPage } from "./error-page/AccessDeniedErrorPage";
import { InternalErrorPage } from "./error-page/InternalErrorPage";
import { NotFoundErrorPage } from "./error-page/NotFoundErrorPage";
import { Category } from "./forum/pages/Category";
import { Forum } from "./forum/pages/Forum";
import { Home } from "./home/pages/Home";
import { LoginPage } from "./login/pages/LoginPage";
import { Navbar } from "./navbar/Navbar";
import { News } from "./news/pages/News";
import { Rules } from "./Rules/Rules";
import { Thread } from "./Thread/pages/Thread";
import { EditUserProfilePage } from "./user/pages/EditUserProfilePage";
import { UserProfilePage } from "./user/pages/UserProfilePage";

function App() {
  return (
    <>
      <IntlProvider lang="hr">
        <AuthProvider>
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile/:id" element={<UserProfilePage />} />
            <Route path="/profile/edit" element={<EditUserProfilePage />} />
          </Routes>
        </AuthProvider>
      </IntlProvider>
    </>
  );
}

export default App;
