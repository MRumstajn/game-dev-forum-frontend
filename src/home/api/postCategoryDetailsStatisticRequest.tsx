import { CategoryDetailsStatisticRequest } from "./CategoryDetailsStatisticRequest";
import { CategoryDetailsStatisticResponse } from "./CategoryDetailsStatisticResponse";
import { CATEGORIES_DETAIL_STATISTIC_URL } from "../../common/Routes";

export async function postCategoryDetailsStatisticRequest(
  request: CategoryDetailsStatisticRequest
): Promise<CategoryDetailsStatisticResponse[]> {
  const response = await fetch(CATEGORIES_DETAIL_STATISTIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return await response.json();
}
