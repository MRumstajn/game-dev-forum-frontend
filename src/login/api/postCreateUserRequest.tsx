import { CreateUserRequest } from "./CreateUserRequest";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { UserResponse } from "../../common/api/UserResponse";
import { USER_URL } from "../../common/Routes";

export async function postCreateUserRequest(
  request: CreateUserRequest
): Promise<BaseResponseWrapper<UserResponse>> {
  const response = await fetch(USER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<UserResponse>;
}
