import { WORK_OFFER_URL } from "../../common/Routes";

export async function deleteWorkOffer(id: number): Promise<Response> {
  return await fetch(`${WORK_OFFER_URL}/${id}`, { method: "DELETE" });
}
