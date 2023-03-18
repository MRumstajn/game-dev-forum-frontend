import { SearchThreadRequest } from "./SearchThreadRequest";
import { ThreadResponse } from "../../common/api/ThreadResponse";
import { THREAD_SEARCH_URL } from "../../common/Routes";

export async function postSearchThreadRequest(
  request: SearchThreadRequest
): Promise<ThreadResponse[]> {
  const response = await fetch(THREAD_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return await response.json();
}
