import { EditCategoryRequest } from "./EditCategoryRequest";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { CategoryResponse } from "../../common/api/CategoryResponse";
import { CATEGORY_URL } from "../../common/Routes";

export async function putEditCategoryRequest(
  id: number,
  request: EditCategoryRequest
): Promise<BaseResponseWrapper<CategoryResponse>> {
  const response = await fetch(`${CATEGORY_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<CategoryResponse>;
}
