import { PostReactionCountResponse } from "./PostReactionCountResponse";
import { POST_REACTION_URL } from "../../common/Routes";

export async function deleteUserPostReaction(
  reactionId: number
): Promise<PostReactionCountResponse[]> {
  const response = await fetch(`${POST_REACTION_URL}/${reactionId}`, {
    method: "DELETE",
  });

  return await response.json();
}
