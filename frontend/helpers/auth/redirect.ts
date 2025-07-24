import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

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
    redirect(`/en/home`);
  }

  const isAuthPages = [`/${locale}/login`, `/${locale}/signup`].includes(
    headerList || ""
  );

  if (!cookieStore && !isAuthPages) {
    redirect(`/${locale}/login`);
  }

  if (cookieStore && isAuthPages) {
    redirect(`/${locale}/home`);
  }

  return { dir }; // if needed later
}
