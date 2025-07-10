import { cookies, headers } from "next/headers";
import "./globals.css";
import { redirect } from "next/navigation";
import { getTransitionClass } from "@/helpers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = (await cookies()).get("token");
  const headerList = (await headers()).get("x-current-path");

  console.log(cookieStore);

  const isPublicRoute = ["/login", "/signup"].includes(headerList || "");
  const isLoginRoute = headerList === "/login";
  if (!cookieStore && !isPublicRoute) {
    redirect("/login");
  }

  if (cookieStore && isLoginRoute) {
    redirect("/");
  }

  // i made all my routes protected except login and signup

  // now what is the best

  return (
    <html lang="en" className="">
      <body className="dark">
        <main
          className={`min-h-screen w-full bg-gray-100 text-black dark:text-white dark:bg-slate-900 ${getTransitionClass}`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
