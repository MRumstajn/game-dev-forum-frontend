const TOKEN_STORAGE_NAME = "access_token";

export function saveToken(token: string) {
  window.localStorage.setItem(TOKEN_STORAGE_NAME, token);
}

export function getToken(): string | null {
  return window.localStorage.getItem(TOKEN_STORAGE_NAME);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_STORAGE_NAME);
}
