import { THREAD_URL } from "../../common/Routes";

export async function getThreadById(id: number) {
  const response = await fetch(`${THREAD_URL}/${id}`, { method: "GET" });

  return await response.json();
}
