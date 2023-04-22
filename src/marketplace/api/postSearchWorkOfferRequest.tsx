import { SearchWorkOffersRequestPageable } from "./SearchWorkOffersRequestPageable";
import { WorkOfferResponse } from "./WorkOfferResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { WORK_OFFER_SEARCH_URL } from "../../common/Routes";
import { PageResponseWrapper } from "../../forum/api/PageResponseWrapper";

export async function postSearchWorkOfferRequest(
  request: SearchWorkOffersRequestPageable
): Promise<BaseResponseWrapper<PageResponseWrapper<WorkOfferResponse>>> {
  const response = await fetch(WORK_OFFER_SEARCH_URL, {
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
  } as BaseResponseWrapper<PageResponseWrapper<WorkOfferResponse>>;
}
