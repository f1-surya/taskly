import { Card } from "@/components/ui/card";
import Image from "next/image";
import SignUpForm from "./form";
import {getSession} from "@/lib/auth";
import {redirect} from "next/navigation";

export default async function SignUp() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col sm:flex-row items-center justify-center sm:gap-24 bg-white">
      <Image
        src="/signup.png"
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
        <SignUpForm />
      </Card>
    </main>
  );
}
