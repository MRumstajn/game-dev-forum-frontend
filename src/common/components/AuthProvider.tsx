import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    const localToken = getToken();
    if (localToken !== undefined) {
      getCurrentUser().then((response) => {
        if (response.status !== 403) {
          setLoggedInUser(response.data);
        }
      });
    }
    navigate("/home");
  }, []);

  const values = {
    loggedInUser,
    setLoggedInUser,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
