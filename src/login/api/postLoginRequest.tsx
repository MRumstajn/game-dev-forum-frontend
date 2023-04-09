import { LoginRequest } from "./LoginRequest";
import { LoginResponse } from "./LoginResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { LOGIN_URL } from "../../common/Routes";

export async function postLoginRequest(
  request: LoginRequest
): Promise<BaseResponseWrapper<LoginResponse>> {
  const response = await fetch(LOGIN_URL, {
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
  } as BaseResponseWrapper<LoginResponse>;
}
