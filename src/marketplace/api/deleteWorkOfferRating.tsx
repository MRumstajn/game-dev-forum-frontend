import { WorkOfferAverageAndTotalRatingResponse } from "./WorkOfferAverageAndTotalRatingResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { WORK_OFFER_RATING_URL } from "../../common/Routes";

export async function deleteWorkOfferRating(
  ratingId: number
): Promise<BaseResponseWrapper<WorkOfferAverageAndTotalRatingResponse>> {
  const response = await fetch(`${WORK_OFFER_RATING_URL}/${ratingId}`, {
    method: "DELETE",
  });

  return {
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<WorkOfferAverageAndTotalRatingResponse>;
}
