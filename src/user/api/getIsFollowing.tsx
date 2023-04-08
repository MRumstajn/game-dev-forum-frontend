import { CheckIsFollowingResponse } from "./CheckIsFollowingResponse";
import { USER_URL } from "../../common/Routes";

export async function getIsFollowing(
  targetUserId: number
): Promise<CheckIsFollowingResponse> {
  const response = await fetch(`${USER_URL}/${targetUserId}/is-following`, {
    method: "GET",
  });

  return await response.json();
}
