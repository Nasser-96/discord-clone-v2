import { makeRequest } from "../axios/axios";
import { AxiosMethods, MemberRoleEnum } from "../types&enums/enums";
import {
  CreateServerFormType,
  LoginFormType,
  SignUpFormType,
} from "../types&enums/types";
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

export const createServerService = (data: CreateServerFormType) => {
  return makeRequest({
    url: urls.server.create,
    method: AxiosMethods.POST,
    data: data,
  });
};

export const updateServerService = (
  data: CreateServerFormType,
  serverId: string
) => {
  return makeRequest({
    url: urls.server.update(serverId),
    method: AxiosMethods.PUT,
    data: data,
  });
};

export const getMyServersService = (isServer: boolean) => {
  return makeRequest({
    isServer: isServer,
    url: urls.server.myServers,
    method: AxiosMethods.GET,
  });
};

export const getServerDataService = (isServer: boolean, serverId: string) => {
  return makeRequest({
    isServer: isServer,
    url: urls.server.serverData(serverId),
    method: AxiosMethods.GET,
  });
};

export const updateServerInviteCodeService = (
  isServer: boolean,
  serverId: string
) => {
  return makeRequest({
    isServer: isServer,
    url: urls.server.updateServerInviteCode(serverId),
    method: AxiosMethods.PUT,
  });
};

export const addUserToServerService = (
  isServer: boolean,
  inviteCode: string
) => {
  return makeRequest({
    isServer: isServer,
    url: urls.server.addUser(inviteCode),
    method: AxiosMethods.POST,
  });
};

export const updateMemberRoleService = (
  serverId: string,
  memberId: string,
  newRole: MemberRoleEnum
) => {
  return makeRequest({
    url: urls.member.updateMemberRole(serverId, memberId),
    method: AxiosMethods.PUT,
    data: { role: newRole },
  });
};

export const removeUserFromServerService = (
  serverId: string,
  memberId: string
) => {
  return makeRequest({
    url: urls.member.removeMember(serverId, memberId),
    method: AxiosMethods.DELETE,
  });
};

export const leaveServerService = (serverId: string) => {
  return makeRequest({
    url: urls.member.leaveServer(serverId),
    method: AxiosMethods.DELETE,
  });
};
