import { ChangeUserPasswordRequest } from "./ChangeUserPasswordRequest";
import { EdituserResponse } from "./EdituserResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { USER_CHANGE_PASSWORD_URL } from "../../common/Routes";

export async function postChangeUserPasswordRequest(
  request: ChangeUserPasswordRequest
): Promise<BaseResponseWrapper<EdituserResponse>> {
  try {
    const response = await fetch(`${USER_CHANGE_PASSWORD_URL}`, {
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
    } as BaseResponseWrapper<EdituserResponse>;
  } catch (err) {
    return Promise.reject("Invalid credentials");
  }
}
