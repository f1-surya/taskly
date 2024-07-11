"use client";

import { Button } from "@/components/ui/button";
import CustomField from "@/components/ui/customfield";
import { login } from "@/lib/auth";
import { useFormState, useFormStatus } from "react-dom";

export default function LoginForm() {
  const [state, action] = useFormState(login, undefined);

  return (
    <form className="flex flex-col items-center gap-2" action={action}>
      <h1 className="text-3xl font-semibold">Login</h1>
      <CustomField name="email" title="Email" type="email" />
      {state?.email && (
        <p className="text-red-500 text-sm self-start">Email not found</p>
      )}
      <CustomField name="password" title="Password" type="password" />
      {state?.password && (
        <p className="text-red-500 text-sm self-start">Wrong password</p>
      )}
      <LoginButton />
      <p className="text-sm">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="text-blue-700">
          Signup
        </a>
      </p>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full mt-4 bg-blue-600" type="submit">
      {pending ? "Logging in..." : "Login"}
    </Button>
  );
}
