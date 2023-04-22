import { RateWorkOfferRequest } from "./RateWorkOfferRequest";
import { WorkOfferRatingResponse } from "./WorkOfferRatingResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { WORK_OFFER_RATING_URL } from "../../common/Routes";

export async function postRateWorkOfferRequest(
  request: RateWorkOfferRequest
): Promise<BaseResponseWrapper<WorkOfferRatingResponse>> {
  const response = await fetch(WORK_OFFER_RATING_URL, {
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
  } as BaseResponseWrapper<WorkOfferRatingResponse>;
}
