import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";
import "../globals.css";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const cookieStore = (await cookies()).get("token");
  const headerList = (await headers()).get("x-current-path");

  const { locale } = await params;
  const dir = locale === "ar" ? "rtl" : "ltr";

  // Ensure the locale is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const isPublicRoute = [`/${locale}/login`, `/${locale}/signup`].includes(
    headerList || ""
  );

  if (!cookieStore && !isPublicRoute) {
    redirect(`${locale}/login`);
  }

  if (cookieStore && isPublicRoute) {
    redirect(`/`);
  }

  return (
    <html suppressHydrationWarning>
      <body>
        <div dir={dir} className="">
          <NextIntlClientProvider>
            <main
              className={`min-h-screen w-full text-white bg-discord-bg transition-all duration-300 ease-in-out`}
            >
              {children}
            </main>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
