import { POST_URL } from "../../common/Routes";

export async function deletePost(id: number): Promise<Response> {
  return await fetch(`${POST_URL}/${id}`, { method: "DELETE" });
}
