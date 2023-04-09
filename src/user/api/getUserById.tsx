import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { UserResponse } from "../../common/api/UserResponse";
import { USER_URL } from "../../common/Routes";

export async function getUserById(
  id: number
): Promise<BaseResponseWrapper<UserResponse>> {
  const response = await fetch(`${USER_URL}/${id}`, { method: "GET" });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<UserResponse>;
}
