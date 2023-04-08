import { UserResponse } from "../../common/api/UserResponse";
import { USER_URL } from "../../common/Routes";

export async function getFollowers(userId: number): Promise<UserResponse[]> {
  const response = await fetch(`${USER_URL}/${userId}/followers`, {
    method: "GET",
  });

  return await response.json();
}
