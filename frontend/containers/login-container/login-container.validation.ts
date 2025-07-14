"use client";
import * as Yup from "yup";

export const loginValidationSchema = (t: any) => {
  const validation = Yup.object({
    identifier: Yup.string().required(t("required")),
    password: Yup.string()
      .min(5, t("passwordTooShort"))
      .required(t("required")),
  });

  return { validation };
};
