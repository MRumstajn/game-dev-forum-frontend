import { ThreadStatisticsRequest } from "./ThreadStatisticsRequest";
import { ThreadStatisticsResponse } from "./ThreadStatisticsResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { THREAD_STATISTICS_URL } from "../../common/Routes";

export async function postThreadStatisticsRequest(
  request: ThreadStatisticsRequest
): Promise<BaseResponseWrapper<ThreadStatisticsResponse[]>> {
  const response = await fetch(THREAD_STATISTICS_URL, {
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
  } as BaseResponseWrapper<ThreadStatisticsResponse[]>;
}
