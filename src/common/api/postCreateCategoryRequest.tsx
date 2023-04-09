import { BaseResponseWrapper } from "./BaseResponseWrapper";
import { CategoryResponse } from "./CategoryResponse";
import { CreateCategoryRequest } from "./CreateCategoryRequest";
import { CATEGORY_URL } from "../Routes";

export async function postCreateCategoryRequest(
  request: CreateCategoryRequest
): Promise<BaseResponseWrapper<CategoryResponse>> {
  const response = await fetch(CATEGORY_URL, {
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
  } as BaseResponseWrapper<CategoryResponse>;
}
