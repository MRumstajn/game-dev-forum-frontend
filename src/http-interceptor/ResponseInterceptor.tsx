import fetchIntercept from "fetch-intercept";

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
            response.request.url.endsWith("/auth/current-user") ||
            window.location.href.endsWith("/home")
          ) {
            console.log("current user arm");
            break;
          }

          if (!window.location.href.includes("/login")) {
            console.log("/403 arm");
            window.location.replace("/403");
          }
          if (response.request.headers.get("Authorization") !== null) {
            console.log("no auth arm");
            clearToken();
            window.location.replace("/login");
          }
          break;
      }

      return response;
    },
  });
}
