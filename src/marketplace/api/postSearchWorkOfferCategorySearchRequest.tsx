import { SearchWorkOfferCategoryRequestPageable } from "./SearchWorkOfferCategoryRequestPageable";
import { WorkOfferCategoryResponse } from "./WorkOfferCategoryResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { WORK_OFFER_CATEGORY_SEARCH_URL } from "../../common/Routes";
import { PageResponseWrapper } from "../../forum/api/PageResponseWrapper";

export async function postSearchWorkOfferCategorySearchRequest(
  request: SearchWorkOfferCategoryRequestPageable
): Promise<
  BaseResponseWrapper<PageResponseWrapper<WorkOfferCategoryResponse>>
> {
  const response = await fetch(WORK_OFFER_CATEGORY_SEARCH_URL, {
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
  } as BaseResponseWrapper<PageResponseWrapper<WorkOfferCategoryResponse>>;
}
