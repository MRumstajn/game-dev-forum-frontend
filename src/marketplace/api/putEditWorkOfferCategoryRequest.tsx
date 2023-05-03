import { EditWorkOfferCategoryRequest } from "./EditWorkOfferCategoryRequest";
import { WorkOfferResponse } from "./WorkOfferResponse";
import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { WORK_OFFER_CATEGORY_URL } from "../../common/Routes";

export async function putEditWorkOfferCategoryRequest(
  id: number,
  request: EditWorkOfferCategoryRequest
): Promise<BaseResponseWrapper<WorkOfferResponse>> {
  const response = await fetch(`${WORK_OFFER_CATEGORY_URL}/${id}`, {
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
