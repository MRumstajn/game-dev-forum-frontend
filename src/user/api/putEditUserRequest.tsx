import { EditUserRequest } from "./EditUserRequest";
import { EdituserResponse } from "./EdituserResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { USER_URL } from "../../common/Routes";

export async function putEditUserRequest(
  userId: number,
  request: EditUserRequest
): Promise<BaseResponseWrapper<EdituserResponse>> {
  const response = await fetch(`${USER_URL}/${userId}`, {
    method: "PUT",
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
}
