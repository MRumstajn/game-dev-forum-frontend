import { SearchWorkOfferRatingRequest } from "./SearchWorkOfferRatingRequest";
import { WorkOfferRatingResponse } from "./WorkOfferRatingResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { WORK_OFFER_RATING_SEARCH_URL } from "../../common/Routes";

export async function postSearchWorkOfferRatingRequest(
  request: SearchWorkOfferRatingRequest
): Promise<BaseResponseWrapper<WorkOfferRatingResponse[]>> {
  const response = await fetch(WORK_OFFER_RATING_SEARCH_URL, {
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
  } as BaseResponseWrapper<WorkOfferRatingResponse[]>;
}
