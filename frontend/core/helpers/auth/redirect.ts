import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import Routes from "../routes";

export async function handleAuthRedirect(
  params: { locale: string },
  navigateUrl?: string
) {
  const cookieStore = (await cookies()).get("token");
  const headerList = (await headers()).get("x-current-path");

  const { locale } = params;
  const dir = locale === "ar" ? "rtl" : "ltr";

  if (navigateUrl) {
    redirect(navigateUrl);
  }

  if (!hasLocale(routing.locales, locale)) {
    redirect(Routes("en").home);
  }

  const isAuthPages = [`/${locale}/login`, `/${locale}/signup`].includes(
    headerList || ""
  );

  if (!cookieStore && !isAuthPages) {
    redirect(Routes(locale).login);
  }

  if (cookieStore && isAuthPages) {
    redirect(Routes(locale).home);
  }

  return { dir }; // if needed later
}
