import { PageResponseWrapper } from "./PageResponseWrapper";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { CategoryResponse } from "../../common/api/CategoryResponse";
import { CATEGORY_SEARCH_URL } from "../../common/Routes";
import { SearchCategoryRequest } from "../../news/api/SearchCategoryRequest";

export async function postSearchCategoryRequest(
  request: SearchCategoryRequest
): Promise<BaseResponseWrapper<PageResponseWrapper<CategoryResponse>>> {
  const response = await fetch(CATEGORY_SEARCH_URL, {
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
  } as BaseResponseWrapper<PageResponseWrapper<CategoryResponse>>;
}
