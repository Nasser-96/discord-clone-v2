"use client";

import { jwtDecode } from "jwt-decode";
import { getAuthToken } from "./auth/token";
import { DecodedTokenType } from "@/core/types&enums/types";

export const getTransitionClass = "transition-all duration-300 ease-in-out";

export const getUserData = () => {
  const token = getAuthToken();
  if (!token) {
    return null;
  }
  const decodedToken = jwtDecode<DecodedTokenType>(token) as DecodedTokenType;
  return decodedToken;
};
