import { GetManyUsersRequest } from "./GetManyUsersRequest";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { UserResponse } from "../../common/api/UserResponse";
import { GET_MANY_USERS_URL } from "../../common/Routes";

export async function getManyUsers(
  request: GetManyUsersRequest
): Promise<BaseResponseWrapper<UserResponse[]>> {
  const response = await fetch(`${GET_MANY_USERS_URL}`, {
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
  } as BaseResponseWrapper<UserResponse[]>;
}
