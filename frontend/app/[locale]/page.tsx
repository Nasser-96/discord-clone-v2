"use client";

import Routes from "@/core/helpers/routes";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This page.tsx basically just to trigger the layout.tsx only
export default function Page() {
  const router = useRouter();
  const locale = useLocale();
  useEffect(() => {
    router.push(Routes(locale).home);
  }, []);
  return <></>;
}
