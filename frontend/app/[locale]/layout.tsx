import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";
import "../globals.css";
import { handleAuthRedirect } from "@/helpers/auth/redirect";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const newParams = await params;
  const { dir } = await handleAuthRedirect(newParams);

  return (
    <html>
      <body>
        <div dir={dir} className="">
          <NextIntlClientProvider>
            <main
              className={`h-screen w-full text-white bg-discord-bg transition-all duration-300 ease-in-out`}
            >
              {children}
            </main>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
