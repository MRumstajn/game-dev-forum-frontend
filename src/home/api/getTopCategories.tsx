import { CategoryResponse } from "../../common/api/CategoryResponse";
import { TOP_CATEGORIES_STATISTIC_URL } from "../../common/Routes";

export async function getTopCategories(): Promise<CategoryResponse[]> {
  const response = await fetch(TOP_CATEGORIES_STATISTIC_URL, {
    method: "GET",
  });

  return await response.json();
}
