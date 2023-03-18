import { OverallStatisticsResponse } from "./OverallStatisticsResponse";
import { OVERALL_STATISTICS_URL } from "../../common/Routes";

export async function getOverallStatistics(): Promise<OverallStatisticsResponse> {
  const response = await fetch(OVERALL_STATISTICS_URL, {
    method: "GET",
  });

  return await response.json();
}
