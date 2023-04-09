import { CreateUserPostReactionRequest } from "./CreateUserPostReactionRequest";
import { UserPostReactionResponse } from "./UserPostReactionResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { POST_REACTION_URL } from "../../common/Routes";

export async function postCreateUserPostReactionRequest(
  request: CreateUserPostReactionRequest
): Promise<BaseResponseWrapper<UserPostReactionResponse>> {
  const response = await fetch(POST_REACTION_URL, {
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
  } as BaseResponseWrapper<UserPostReactionResponse>;
}
