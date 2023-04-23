import { CreateOrEditWorkOfferCategoryRequest } from "./CreateOrEditWorkOfferCategoryRequest";
import { WorkOfferCategoryResponse } from "./WorkOfferCategoryResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { WORK_OFFER_CATEGORY_URL } from "../../common/Routes";

export async function postCreateWorkOfferCategoryRequest(
  request: CreateOrEditWorkOfferCategoryRequest
): Promise<BaseResponseWrapper<WorkOfferCategoryResponse>> {
  const response = await fetch(WORK_OFFER_CATEGORY_URL, {
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
  } as BaseResponseWrapper<WorkOfferCategoryResponse>;
}
