"use client";

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
  destroyCookie(null, TOKEN_KEY);
};

export const getAuthToken = () => {
  const cookies = parseCookies();
  return cookies[TOKEN_KEY];
};
