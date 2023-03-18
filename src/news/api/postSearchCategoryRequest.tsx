import { SearchCategoryRequest } from "./SearchCategoryRequest";
import { CategoryResponse } from "../../common/api/CategoryResponse";
import { CATEGORY_SEARCH_URL } from "../../common/Routes";

export async function postSearchCategoryRequest(
  request: SearchCategoryRequest
): Promise<CategoryResponse[]> {
  const response = await fetch(CATEGORY_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return await response.json();
}
