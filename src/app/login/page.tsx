import { Card } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login | Task Manager",
};

export default async function Login() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col sm:flex-row items-center justify-center gap-24 bg-white">
      <Image
        src="/login.jpg"
        alt="Logo"
        width={400}
        height={400}
        className="hidden sm:block"
      />
      <Card className="p-12">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={50}
          height={50}
          className="mx-auto"
        />
        <LoginForm />
      </Card>
    </main>
  );
}
