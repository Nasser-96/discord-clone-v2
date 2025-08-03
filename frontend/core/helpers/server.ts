import { jwtDecode } from "jwt-decode";
import { DecodedTokenType } from "../types&enums/types";
import { getServerToken } from "./auth/token-from-server";

export const getUserDataFromServer = async () => {
  const token = await getServerToken();
  const userData = jwtDecode<DecodedTokenType>(token ?? "") as DecodedTokenType;
  return userData;
};
