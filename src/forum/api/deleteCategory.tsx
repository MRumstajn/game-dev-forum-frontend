import { BaseResponseWrapper } from "../../common/api/BaseResponseWrapper";
import { CATEGORY_URL } from "../../common/Routes";

export async function deleteCategory(
  id: number
): Promise<BaseResponseWrapper<void>> {
  const response = await fetch(`${CATEGORY_URL}/${id}`, { method: "DELETE" });

  return {
    status: response.status,
    isOk: response.ok,
  } as BaseResponseWrapper<void>;
}
