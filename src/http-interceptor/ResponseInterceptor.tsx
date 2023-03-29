import fetchIntercept from "fetch-intercept";

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
          if (!window.location.href.includes("/login")) {
            window.location.replace("/403");
          }
          break;
      }
      return response;
    },
  });
}
