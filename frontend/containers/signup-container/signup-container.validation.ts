"use client";
import * as Yup from "yup";

export const ValidationSchema = (t: any) => {
  const validation = Yup.object({
    username: Yup.string().required(t("required")),

    email: Yup.string().email(t("invalidEmail")).required(t("required")),

    password: Yup.string()
      .min(5, t("passwordTooShort"))
      .required(t("required")),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("passwordsMustMatch"))
      .required(t("required")),
  });

  return { validation };
};
