import fetchIntercept from "fetch-intercept";

import { getToken } from "../util/jwtTokenUtils";

export function RequestInterceptor() {
  fetchIntercept.register({
    request(url: string, config: any): Promise<any[]> | any[] {
      const localToken = getToken();

      if (localToken !== null) {
        config.headers["Authorization"] = `Bearer ${localToken}`;
      }

      return [url, config];
    },
  });
}
