import { PostReactionCountResponse } from "./PostReactionCountResponse";
import { SearchPostReactionCountRequest } from "./SearchPostReactionCountRequest";
import { POST_REACTION_COUNT_URL } from "../../common/Routes";

export async function postSearchPostReactionCountRequest(
  request: SearchPostReactionCountRequest
): Promise<PostReactionCountResponse[]> {
  const response = await fetch(`${POST_REACTION_COUNT_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return await response.json();
}
