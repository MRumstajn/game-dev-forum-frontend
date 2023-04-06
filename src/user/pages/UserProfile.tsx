import { useContext } from "react";

import { Typography } from "@tiller-ds/core";

import { UserProfileDataPage } from "./UserProfileDataPage";
import { AuthContext } from "../../common/components/AuthProvider";

export function UserProfile() {
  const authContext = useContext(AuthContext);

  return (
    <>
      {authContext.loggedInUser && <UserProfileDataPage />}
      {authContext.loggedInUser === undefined && (
        <div className="text-center">
          <Typography variant="title" element="h3">
            Ops! You must be logged in to view this page
          </Typography>
        </div>
      )}
    </>
  );
}
