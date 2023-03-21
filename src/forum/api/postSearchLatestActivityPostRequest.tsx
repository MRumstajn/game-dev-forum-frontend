import { SearchLatestActivityPostRequest } from "./SearchLatestActivityPostRequest";
import { POST_WITH_LATEST_ACTIVITY_URL } from "../../common/Routes";

export async function postSearchLatestActivityPostRequest(
  request: SearchLatestActivityPostRequest
) {
  const response = await fetch(POST_WITH_LATEST_ACTIVITY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return await response.json();
}
