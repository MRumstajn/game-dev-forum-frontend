import { CreatePostRequest } from "./CreatePostRequest";
import { PostResponse } from "../../common/api/PostResponse";
import { POST_URL } from "../../common/Routes";

export async function postCreatePostRequest(
  request: CreatePostRequest
): Promise<PostResponse> {
  const response = await fetch(POST_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return await response.json();
}
