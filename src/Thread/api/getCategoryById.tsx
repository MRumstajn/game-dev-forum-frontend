import { CATEGORY_URL } from "../../common/Routes";

export async function getCategoryById(id: number) {
  const response = await fetch(`${CATEGORY_URL}/${id}`, { method: "GET" });

  return await response.json();
}
