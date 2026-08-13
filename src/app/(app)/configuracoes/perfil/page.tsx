import type { Metadata } from "next";
import { getSessionContext } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileForms } from "./profile-forms";

export const metadata: Metadata = { title: "Perfil" };

export default async function ProfilePage() {
  const context = await getSessionContext();
  if (!context) redirect("/pipeline");

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <h1 className="text-2xl font-semibold text-primary">Perfil</h1>
      <ProfileForms
        fullName={context.profile.fullName ?? ""}
        email={context.user.email}
        role={context.membership.role}
      />
    </section>
  );
}
