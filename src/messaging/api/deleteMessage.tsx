import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { MESSAGE_URL } from "../../common/Routes";

export async function deleteMessage(
  id: number
): Promise<BaseResponseWrapper<void>> {
  const response = await fetch(`${MESSAGE_URL}/${id}`, { method: "DELETE" });
  return {
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<void>;
}
