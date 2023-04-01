import { StatusWrappedResponse } from "./StatusWrappedResponse";
import { UserResponse } from "./UserResponse";
import { CURRENT_USER_URL } from "../Routes";

export async function getCurrentUser(): Promise<
  StatusWrappedResponse<UserResponse>
> {
  const response = await fetch(CURRENT_USER_URL, { method: "GET" });

  return {
    status: response.status,
    isOk: response.ok,
    data: await response.json(),
  } as StatusWrappedResponse<UserResponse>;
}
