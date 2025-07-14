"use client";
import Button from "@/components/shared/Button";
import { getUserData } from "@/helpers";
import { removeAuthToken } from "@/helpers/auth/token";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomeContainer() {
  const router = useRouter();
  const local = useLocale();
  const userData = getUserData();

  const handleLogout = () => {
    removeAuthToken();
    router.push(`/${local}/login`);
  };

  console.log(userData);

  return <Button onClick={handleLogout}>Logout</Button>;
}
