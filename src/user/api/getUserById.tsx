import { UserResponse } from "../../common/api/UserResponse";
import { USER_URL } from "../../common/Routes";

export async function getUserById(id: number): Promise<UserResponse> {
  const response = await fetch(`${USER_URL}/${id}`, { method: "GET" });

  return await response.json();
}
