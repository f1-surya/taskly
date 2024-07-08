"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CustomField from "@/components/ui/customfield";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignUp() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col sm:flex-row items-center justify-center gap-4 sm:gap-16 my-4">
      <Image
        src="/signup.png"
        alt="Logo"
        width={300}
        height={300}
        className="bg-blend-multiply bg-secondary object-cover"
      />
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
            const names = form.get('fullname')!.toString().split(' ');
            if (names.length <= 1) {
              return toast.error("Please enter your full name");
            }
            if (form.get("password") !== form.get("confirmPassword")) {
              return toast.error("Passwords do not match");
            }
            const response = await fetch("/api/auth/signup", {
              method: "POST",
              body: form,
            });
            const data = await response.json();
            if (response.status === 201) {
              router.push("/");
            } else {
              toast.error(data.message);
            }
          }}
        >
          <h1 className="text-3xl font-semibold">Signup</h1>
          <CustomField name="fullname" title="Fullname" />
          <CustomField name="email" title="Email" type="email" />
          <CustomField name="password" title="Password" />
          <CustomField
            name="confirmPassword"
            title="Confirm Password"
            type="password"
          />
          <Button className="w-full mt-4 bg-blue-600" type="submit">
            Create account
          </Button>
          <p className="text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-700">
              Login
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
}
