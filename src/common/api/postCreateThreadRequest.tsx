import { CreateThreadRequest } from "./CreateThreadRequest";
import { ThreadResponse } from "./ThreadResponse";
import { THREAD_URL } from "../Routes";

export async function postCreateThreadRequest(
  request: CreateThreadRequest
): Promise<ThreadResponse> {
  const response = await fetch(THREAD_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return await response.json();
}
