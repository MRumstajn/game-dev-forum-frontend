import { BaseResponseWrapper } from "./BaseResponseWrapper";
import { UserResponse } from "./UserResponse";
import { CURRENT_USER_URL } from "../Routes";

export async function getCurrentUser(): Promise<
  BaseResponseWrapper<UserResponse>
> {
  const response = await fetch(CURRENT_USER_URL, { method: "GET" });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<UserResponse>;
}
