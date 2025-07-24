import { addUserToServerService } from "@/core/model/services";
import { redirect } from "next/navigation";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ locale: string; inviteCode: string }>;
}) {
  const newParams = await params;
  const locale = newParams.locale ?? "en";
  let id: string | undefined;

  try {
    const res = await addUserToServerService(true, newParams.inviteCode);
    id = res.response.id;
  } catch (err) {
    console.error("Error during invite:", err);
  }

  // NOTE: redirect will NOT work inside try-catch block in server components
  // so we handle it outside the try-catch block
  if (id) {
    const redirectUrl = `/${locale}/home/${id}`;
    redirect(redirectUrl);
  } else {
    const fallbackUrl = `/${locale}/home`;
    redirect(fallbackUrl);
  }

  return <></>;
}
