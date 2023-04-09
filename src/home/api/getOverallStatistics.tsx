import { OverallStatisticsResponse } from "./OverallStatisticsResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { OVERALL_STATISTICS_URL } from "../../common/Routes";

export async function getOverallStatistics(): Promise<
  BaseResponseWrapper<OverallStatisticsResponse>
> {
  const response = await fetch(OVERALL_STATISTICS_URL, {
    method: "GET",
  });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<OverallStatisticsResponse>;
}
