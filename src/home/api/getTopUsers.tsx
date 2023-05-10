import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { UserResponse } from "../../common/api/UserResponse";
import { TOP_USERS_URL } from "../../common/Routes";

export async function getTopUsers(): Promise<
  BaseResponseWrapper<UserResponse[]>
> {
  const response = await fetch(TOP_USERS_URL, {
    method: "GET",
  });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<UserResponse[]>;
}
