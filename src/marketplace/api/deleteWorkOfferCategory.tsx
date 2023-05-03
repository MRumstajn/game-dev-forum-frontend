import { WORK_OFFER_CATEGORY_URL } from "../../common/Routes";

export async function deleteWorkOfferCategory(id: number): Promise<Response> {
  return await fetch(`${WORK_OFFER_CATEGORY_URL}/${id}`, { method: "DELETE" });
}
