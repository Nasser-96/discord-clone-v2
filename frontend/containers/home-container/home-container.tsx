"use client";
import Button from "@/components/shared/Button";
import UploadImage from "@/components/shared/UploadImage";
import { getUserData } from "@/helpers";
import { removeAuthToken } from "@/helpers/auth/token";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomeContainer() {
  const router = useRouter();
  const local = useLocale();
  const userData = getUserData();

  const handleLogout = () => {
    removeAuthToken();
    router.push(`/${local}/login`);
  };

  return <>ggs</>;
}
