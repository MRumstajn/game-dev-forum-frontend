import { CheckIsFollowingResponse } from "./CheckIsFollowingResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { USER_URL } from "../../common/Routes";

export async function getIsFollowing(
  targetUserId: number
): Promise<BaseResponseWrapper<CheckIsFollowingResponse>> {
  const response = await fetch(`${USER_URL}/${targetUserId}/is-following`, {
    method: "GET",
  });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<CheckIsFollowingResponse>;
}
