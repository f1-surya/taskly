"use client";

import { Button } from "@/components/ui/button";
import CustomField from "@/components/ui/customfield";
import { signUp } from "@/lib/auth";
import { useFormState, useFormStatus } from "react-dom";

export default function SignUpForm() {
  const [state, action] = useFormState(signUp, undefined);

  return (
    <form className="flex flex-col items-center gap-2" action={action}>
      <h1 className="text-3xl font-semibold">Signup</h1>
      <CustomField name="fullname" title="Fullname" />
      {state?.name && (
        <p className="text-red-500 text-sm self-start">
          Please enter your full name.
        </p>
      )}
      <CustomField name="email" title="Email" type="email" />
      {state?.email && (
        <p className="text-red-500 text-sm self-start">
          User with this email already exists.
        </p>
      )}
      <CustomField name="password" title="Password" />
      <CustomField
        name="confirmPassword"
        title="Confirm Password"
        type="password"
      />
      {state?.match && (
        <p className="text-red-500 text-sm self-start">
          Passwords do not match.
        </p>
      )}
      <SignUpButton />
      <p className="text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-700">
          Login
        </a>
      </p>
    </form>
  );
}

function SignUpButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full mt-4 bg-blue-600" type="submit">
      {pending ? "Creating account..." : "Create account"}
    </Button>
  );
}
