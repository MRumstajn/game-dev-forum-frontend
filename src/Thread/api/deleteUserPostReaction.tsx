import { PostReactionCountResponse } from "./PostReactionCountResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { POST_REACTION_URL } from "../../common/Routes";

export async function deleteUserPostReaction(
  reactionId: number
): Promise<BaseResponseWrapper<PostReactionCountResponse[]>> {
  const response = await fetch(`${POST_REACTION_URL}/${reactionId}`, {
    method: "DELETE",
  });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<PostReactionCountResponse[]>;
}
