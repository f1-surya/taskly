"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CustomField from "@/components/ui/customfield";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col sm:flex-row items-center justify-center gap-4">
      <div className="relative">
        <Image
          src="/login.jpg"
          alt="Logo"
          width={300}
          height={300}
          className="bg-blend-multiply bg-secondary object-cover"
        />
        <div className="absolute inset-0 bg-background opacity-30"></div>
      </div>
      <Card className="p-12">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={50}
          height={50}
          className="mx-auto"
        />
        <form
          className="flex flex-col items-center gap-2"
          action={async (form) => {
            const response = await fetch("/api/auth/login", {
              method: "POST",
              body: form,
            });
            if (response.status === 200) {
              router.push("/");
              router.refresh();
            } else if (response.status === 404) {
              toast.error("User not found");
            }
          }}
        >
          <h1 className="text-3xl font-semibold">Login</h1>
          <CustomField name="email" title="Email" type="email" />
          <CustomField name="password" title="Password" type="password" />
          <Button className="w-full mt-4 bg-blue-600" type="submit">
            Login
          </Button>
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-700">
              Signup
            </a>
          </p>
        </form>
      </Card>
    </main>
  );
}
