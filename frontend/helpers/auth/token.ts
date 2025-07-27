import { setCookie, destroyCookie, parseCookies } from "nookies";

const TOKEN_KEY = "token";
const MAX_AGE = 60 * 60 * 24 * 2; // 2 days

export const setAuthToken = (token: string) => {
  setCookie(null, TOKEN_KEY, token, {
    maxAge: MAX_AGE,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const removeAuthToken = () => {
  destroyCookie(null, TOKEN_KEY, {
    path: "/",
  });
};

export const getAuthToken = () => {
  const cookieClient = parseCookies();
  return cookieClient["token"];
};
