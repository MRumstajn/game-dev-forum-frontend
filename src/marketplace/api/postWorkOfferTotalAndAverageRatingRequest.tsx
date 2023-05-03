import { WorkOfferAverageAndTotalRatingRequest } from "./WorkOfferAverageAndTotalRatingRequest";
import { WorkOfferAverageAndTotalRatingResponse } from "./WorkOfferAverageAndTotalRatingResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { WORK_OFFER_AVERAGE_TOTAL_RATING_URL } from "../../common/Routes";

export async function postWorkOfferTotalAndAverageRatingRequest(
  request: WorkOfferAverageAndTotalRatingRequest
): Promise<BaseResponseWrapper<WorkOfferAverageAndTotalRatingResponse[]>> {
  const response = await fetch(WORK_OFFER_AVERAGE_TOTAL_RATING_URL, {
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
  } as BaseResponseWrapper<WorkOfferAverageAndTotalRatingResponse[]>;
}
