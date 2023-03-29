import { LoginRequest } from "./LoginRequest";
import { LoginResponse } from "./LoginResponse";
import { StatusWrappedResponse } from "../../common/api/StatusWrappedResponse";
import { LOGIN_URL } from "../../common/Routes";

export async function postLoginRequest(
  request: LoginRequest
): Promise<StatusWrappedResponse<LoginResponse>> {
  const response = await fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return {
    status: response.status,
    isOk: response.ok,
    data: await response.json(),
  } as StatusWrappedResponse<LoginResponse>;
}
