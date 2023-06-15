import React, { useEffect, useMemo, useState } from "react";

import { getToken } from "../../util/jwtTokenUtils";
import { getCurrentUser } from "../api/getCurrentUser";
import { UserResponse } from "../api/UserResponse";

export const AuthContext = React.createContext({
  loggedInUser: {} as UserResponse | undefined,
  setLoggedInUser: (user: UserResponse | undefined) => {},
});

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [loggedInUser, setLoggedInUser] = useState<UserResponse | undefined>(
    undefined
  );

  useEffect(() => {
    const localToken = getToken();
    if (localToken !== undefined) {
      getCurrentUser().then((response) => {
        if (response.status !== 403) {
          setLoggedInUser(response.data);
        }
      });
    }
    if (window.location.pathname === "/") {
      window.location.href = "/home";
    }
  }, []);

  const values = useMemo(
    () => ({
      loggedInUser,
      setLoggedInUser,
    }),
    [loggedInUser]
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
