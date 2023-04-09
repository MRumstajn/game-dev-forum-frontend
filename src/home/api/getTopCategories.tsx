import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { CategoryResponse } from "../../common/api/CategoryResponse";
import { TOP_CATEGORIES_STATISTIC_URL } from "../../common/Routes";

export async function getTopCategories(): Promise<
  BaseResponseWrapper<CategoryResponse[]>
> {
  const response = await fetch(TOP_CATEGORIES_STATISTIC_URL, {
    method: "GET",
  });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<CategoryResponse[]>;
}
