import { CreateOrEditWorkOfferRequest } from "./CreateOrEditWorkOfferRequest";
import { WorkOfferResponse } from "./WorkOfferResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { WORK_OFFER_URL } from "../../common/Routes";

export async function putEditWorkOfferRequest(
  id: number,
  request: CreateOrEditWorkOfferRequest
): Promise<BaseResponseWrapper<WorkOfferResponse>> {
  const response = await fetch(`${WORK_OFFER_URL}/${id}`, {
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
  } as BaseResponseWrapper<WorkOfferResponse>;
}
