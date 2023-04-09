import { UserFollowerResponse } from "./UserFollowerResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { USER_URL } from "../../common/Routes";

export async function followUser(
  userId: number
): Promise<BaseResponseWrapper<UserFollowerResponse>> {
  const response = await fetch(`${USER_URL}/${userId}/follow`, {
    method: "POST",
  });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<UserFollowerResponse>;
}
