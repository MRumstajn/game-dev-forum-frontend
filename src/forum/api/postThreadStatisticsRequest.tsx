import { ThreadStatisticsRequest } from "./ThreadStatisticsRequest";
import { THREAD_STATISTICS_URL } from "../../common/Routes";

export async function postThreadStatisticsRequest(
  request: ThreadStatisticsRequest
) {
  const response = await fetch(THREAD_STATISTICS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return await response.json();
}
