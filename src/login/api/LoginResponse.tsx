import { UserResponse } from "../../common/api/UserResponse";

export type LoginResponse = {
  user: UserResponse;

  accessToken: string;
};
