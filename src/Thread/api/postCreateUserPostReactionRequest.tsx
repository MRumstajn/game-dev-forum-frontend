import { CreateUserPostReactionRequest } from "./CreateUserPostReactionRequest";
import { UserPostReactionResponse } from "./UserPostReactionResponse";
import { POST_REACTION_URL } from "../../common/Routes";

export async function postCreateUserPostReactionRequest(
  request: CreateUserPostReactionRequest
): Promise<UserPostReactionResponse> {
  const response = await fetch(POST_REACTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return await response.json();
}
