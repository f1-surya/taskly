import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CustomField from "@/components/ui/customfield";
import { auth, signIn } from "auth";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | Task Manager",
};

export default async function Login() {
  const session = await auth();
  if (session?.user) {
    redirect("/tasks");
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
        {process.env.NODE_ENV === "development" && (
          <form
            className="flex flex-col items-center gap-2"
            action={async (formData) => {
              "use server";
              await signIn("credentials", formData);
            }}
          >
            <h1 className="text-3xl font-semibold">Login</h1>
            <CustomField name="password" title="Password" type="password" />
            <Button type="submit">Login</Button>
          </form>
        )}
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <Button>Login with GitHub</Button>
        </form>
      </Card>
    </main>
  );
}
