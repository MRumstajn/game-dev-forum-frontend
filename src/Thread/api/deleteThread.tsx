import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { THREAD_URL } from "../../common/Routes";

export async function deleteThread(
  id: number
): Promise<BaseResponseWrapper<void>> {
  const response = await fetch(`${THREAD_URL}/${id}`, { method: "DELETE" });

  return {
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<void>;
}
