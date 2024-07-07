"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CustomField from "@/components/ui/customfield";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    fullname: z.string().min(5),
    email: z.string().email("Invalid email"),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export default function SignUp() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <main className="flex min-h-screen flex-col sm:flex-row items-center justify-center gap-4 sm:gap-16 my-4">
      <Image
        src="/signup.png"
        alt="Logo"
        width={300}
        height={300}
        className="bg-blend-multiply bg-secondary object-cover"
      />
      <Card className="p-12">
        <Form {...form}>
          <Image
            src="/logo.svg"
            alt="Logo"
            width={50}
            height={50}
            className="mx-auto"
          />
          <form className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-semibold">Signup</h1>
            <CustomField name="fullname" title="Fullname" />
            <CustomField name="email" title="Email" type="email" />
            <CustomField name="password" title="Password" />
            <CustomField
              name="confirmPassword"
              title="Confirm Password"
              type="password"
            />
            <Button className="w-full mt-4 bg-blue-600">Create account</Button>
            <p className="text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-blue-700">
                Login
              </a>
            </p>
          </form>
        </Form>
      </Card>
    </main>
  );
}
