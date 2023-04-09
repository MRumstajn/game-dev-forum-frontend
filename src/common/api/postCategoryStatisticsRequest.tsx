import { BaseResponseWrapper } from "./BaseResponseWrapper";
import { CategoryStatisticsRequest } from "./CategoryStatisticsRequest";
import { CategoryStatisticsResponse } from "./CategoryStatisticsResponse";
import { CATEGORY_STATISTICS_URL } from "../Routes";

export async function postCategoryStatisticsRequest(
  request: CategoryStatisticsRequest
): Promise<BaseResponseWrapper<CategoryStatisticsResponse[]>> {
  const response = await fetch(CATEGORY_STATISTICS_URL, {
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
  } as BaseResponseWrapper<CategoryStatisticsResponse[]>;
}
