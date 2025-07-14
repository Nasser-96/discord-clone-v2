import { makeRequest } from "../axios/axios";
import { AxiosMethods } from "../types&enums/enums";
import { LoginFormType, SignUpFormType } from "../types&enums/types";
import { urls } from "./urls";

export const SignupService = (data: SignUpFormType) => {
  const newData = {
    username: data.username,
    email: data.email,
    password: data.password,
  };
  return makeRequest({
    url: urls.auth.signup,
    method: AxiosMethods.POST,
    data: newData,
  });
};

export const LoginService = (data: LoginFormType) => {
  return makeRequest({
    url: urls.auth.login,
    method: AxiosMethods.POST,
    data: data,
  });
};
