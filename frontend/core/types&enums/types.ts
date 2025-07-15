export type ReturnResponseType<T> = {
  is_successful: boolean;
  error_msg: string;
  success: string;
  response: T;
};

export type SignUpFormType = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginFormType = {
  identifier: string;
  password: string;
};

export type DecodedTokenType = {
  id: string;
  username: string;
  email: string;
};

export type UploadImageResponseType = {
  image_url: string;
};

export type CreateServerFormType = {
  name: string;
  image: string;
};
