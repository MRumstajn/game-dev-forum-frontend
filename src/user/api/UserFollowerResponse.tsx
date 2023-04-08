import { UserResponse } from "../../common/api/UserResponse";

export type UserFollowerResponse = {
  id: number;

  follower: UserResponse;

  followedUser: UserResponse;
};
