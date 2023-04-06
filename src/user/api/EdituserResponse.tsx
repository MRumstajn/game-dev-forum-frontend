import { UserResponse } from "../../common/api/UserResponse";

export type EdituserResponse = {
  user: UserResponse;

  newAccessToken: string;
};
