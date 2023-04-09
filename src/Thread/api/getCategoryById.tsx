import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { CategoryResponse } from "../../common/api/CategoryResponse";
import { CATEGORY_URL } from "../../common/Routes";

export async function getCategoryById(
  id: number
): Promise<BaseResponseWrapper<CategoryResponse>> {
  const response = await fetch(`${CATEGORY_URL}/${id}`, {
    method: "GET",
  });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<CategoryResponse>;
}
