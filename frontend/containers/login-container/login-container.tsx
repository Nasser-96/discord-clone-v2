"use client";

import Button from "@/components/shared/Button";
import InputField from "@/components/shared/InputField";
import { useTranslations } from "next-intl";
import Link from "next/link";
import AuthUiContainer from "../auth-ui-container/auth-ui-container";
import { useFormik } from "formik";
import { LoginFormType, ReturnResponseType } from "@/core/types&enums/types";
import { loginValidationSchema } from "./login-container.validation";
import { LoginService } from "@/core/model/services";
import { setAuthToken } from "@/helpers/auth/token";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginContainer() {
  const t = useTranslations("Login");
  const errorTranslation = useTranslations("error");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { validation } = loginValidationSchema(errorTranslation);

  const formik = useFormik<LoginFormType>({
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: validation,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const loginData: ReturnResponseType<{ token: string }> =
          await LoginService(values);
        if (loginData.is_successful) {
          setAuthToken(loginData.response.token);
        }
        router.push("/");
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <AuthUiContainer title={t("title")}>
        <>
          <InputField
            aria-label={t("identifier")}
            placeholder={t("identifierPlaceholder")}
            type="text"
            name="identifier"
            onChange={formik.handleChange}
            value={formik.values.identifier}
            onBlur={formik.handleBlur}
            error={
              formik.touched.identifier && formik.errors.identifier
                ? formik.errors.identifier
                : ""
            }
          />
          <InputField
            aria-label={t("password")}
            placeholder={t("passwordPlaceholder")}
            type="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            onBlur={formik.handleBlur}
            error={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : ""
            }
          />
          <Button
            isLoading={isLoading}
            disabled={isLoading}
            type="submit"
            className="bg-discord-primary w-full"
          >
            {t("login")}
          </Button>
          <div className="text-center text-sm text-gray-400">
            {t("noAccount")}{" "}
            <Link
              href={"signup"}
              className="text-discord-primary hover:underline"
            >
              {t("register")}
            </Link>
          </div>
        </>
      </AuthUiContainer>
    </form>
  );
}
