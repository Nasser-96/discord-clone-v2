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

export const uploadImageService = (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  return makeRequest({
    url: urls.upload.image,
    method: AxiosMethods.POST,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
