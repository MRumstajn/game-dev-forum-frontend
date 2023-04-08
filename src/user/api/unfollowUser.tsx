import { USER_URL } from "../../common/Routes";

export async function unfollowUser(userId: number): Promise<Response> {
  return await fetch(`${USER_URL}/${userId}/unfollow`, {
    method: "POST",
  });
}
