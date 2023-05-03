import { WorkOfferResponse } from "./WorkOfferResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { WORK_OFFER_URL } from "../../common/Routes";

export async function getWorkOfferById(
  id: number
): Promise<BaseResponseWrapper<WorkOfferResponse>> {
  const response = await fetch(`${WORK_OFFER_URL}/${id}`, {
    method: "GET",
  });

  return {
    ...(await response.json()),
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<WorkOfferResponse>;
}
