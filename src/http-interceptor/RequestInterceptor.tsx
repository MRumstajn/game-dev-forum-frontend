import fetchIntercept from "fetch-intercept";

export function RequestInterceptor() {
  fetchIntercept.register({
    request(url: string, config: any): Promise<any[]> | any[] {
      const localToken = window.localStorage.getItem("access_token");
      if (localToken !== null) {
        config.headers["Authorization"] = `Bearer ${localToken}`;
      }

      return [url, config];
    },
  });
}
