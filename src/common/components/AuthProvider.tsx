import React, { useState } from "react";

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

  const values = {
    loggedInUser,
    setLoggedInUser,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
