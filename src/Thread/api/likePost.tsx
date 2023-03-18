import { PostResponse } from "../../common/api/PostResponse";
import { POST_URL } from "../../common/Routes";

export async function likePost(id: number): Promise<PostResponse> {
  const response = await fetch(`${POST_URL}/${id}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}
