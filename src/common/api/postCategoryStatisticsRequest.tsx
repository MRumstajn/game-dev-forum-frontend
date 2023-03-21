import { CategoryStatisticsRequest } from "./CategoryStatisticsRequest";
import { CategoryStatisticsResponse } from "./CategoryStatisticsResponse";
import { CATEGORY_STATISTICS_URL } from "../Routes";

export async function postCategoryStatisticsRequest(
  request: CategoryStatisticsRequest
): Promise<CategoryStatisticsResponse[]> {
  const response = await fetch(CATEGORY_STATISTICS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return await response.json();
}
