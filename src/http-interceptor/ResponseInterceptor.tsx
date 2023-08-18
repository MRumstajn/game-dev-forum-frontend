import fetchIntercept from "fetch-intercept";

import { USER_CHANGE_PASSWORD_URL } from "../common/Routes";
import { clearToken } from "../util/jwtTokenUtils";

export function ResponseInterceptor() {
  fetchIntercept.register({
    response: function (response) {
      switch (response.status) {
        case 500:
          window.location.replace("/500");
          break;
        case 404:
          window.location.replace("/404");
          break;
        case 403:
          if (
            response.request.headers.get("Authorization") !== null &&
            !response.request.url.includes(USER_CHANGE_PASSWORD_URL)
          ) {
            clearToken();
            window.location.replace("/login");
          }
          break;
      }

      return response;
    },
  });
}
