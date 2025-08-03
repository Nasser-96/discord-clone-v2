"use client";
import { useLocale, useTranslations } from "next-intl";

import InputField from "@/components/shared/InputField";
import { useRouter } from "next/navigation";
import Button from "@/components/shared/Button";
import Link from "next/link";
import AuthUiContainer from "../auth-ui-container/auth-ui-container";
import { useFormik } from "formik";
import { ValidationSchema } from "./signup-container.validation";
import { ReturnResponseType, SignUpFormType } from "@/core/types&enums/types";
import { SignupService } from "@/core/model/services";
import { setAuthToken } from "@/core/helpers/auth/token";
import { ColorEnum } from "@/core/types&enums/enums";
import Routes from "@/core/helpers/routes";

export default function SignupContainer() {
  const t = useTranslations("signup");
  const errorTranslation = useTranslations("error");
  const { validation } = ValidationSchema(errorTranslation);
  const local = useLocale();
  const router = useRouter();

  const formik = useFormik<SignUpFormType>({
    initialValues: {
      confirmPassword: "",
      email: "",
      password: "",
      username: "",
    },
    validationSchema: validation,
    onSubmit: async (values) => {
      try {
        const signupData: ReturnResponseType<{ token: string }> =
          await SignupService(values);

        if (signupData.is_successful) {
          setAuthToken(signupData.response.token);
        }
        router.push(Routes(local).home);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <AuthUiContainer title={t("title")}>
        <>
          <InputField
            aria-label={t("username")}
            placeholder={t("usernamePlaceholder")}
            type="text"
            name="username"
            onChange={formik.handleChange}
            value={formik.values.username}
            onBlur={formik.handleBlur}
            error={
              formik.touched.username && formik.errors.username
                ? formik.errors.username
                : ""
            }
          />
          <InputField
            aria-label={t("email")}
            placeholder={t("emailPlaceholder")}
            type="email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur}
            error={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
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
          <InputField
            aria-label={t("confirmPassword")}
            placeholder={t("confirmPasswordPlaceholder")}
            type="password"
            name="confirmPassword"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? formik.errors.confirmPassword
                : ""
            }
          />
          <Button
            color={ColorEnum.PRIMARY}
            type="submit"
            className="bg-discord-primary w-full"
          >
            {t("register")}
          </Button>
          <div className="text-center text-sm text-gray-400">
            {t("alreadyHaveAccount")}{" "}
            <Link href="login" className="text-discord-primary hover:underline">
              {t("loginNow")}
            </Link>
          </div>
        </>
      </AuthUiContainer>
    </form>
  );
}
