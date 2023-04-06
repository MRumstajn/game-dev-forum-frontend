import { ChangeUserPasswordRequest } from "./ChangeUserPasswordRequest";
import { EdituserResponse } from "./EdituserResponse";
import { USER_CHANGE_PASSWORD_URL } from "../../common/Routes";

export async function postChangeUserPasswordRequest(
  request: ChangeUserPasswordRequest
): Promise<EdituserResponse> {
  const response = await fetch(`${USER_CHANGE_PASSWORD_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return await response.json();
}
