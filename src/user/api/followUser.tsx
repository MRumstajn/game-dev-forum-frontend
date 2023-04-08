import { UserFollowerResponse } from "./UserFollowerResponse";
import { StatusWrappedResponse } from "../../common/api/StatusWrappedResponse";
import { USER_URL } from "../../common/Routes";

export async function followUser(
  userId: number
): Promise<StatusWrappedResponse<UserFollowerResponse>> {
  const response = await fetch(`${USER_URL}/${userId}/follow`, {
    method: "POST",
  });

  return {
    isOk: response.ok,
    status: response.status,
    data: await response.json(),
  };
}
