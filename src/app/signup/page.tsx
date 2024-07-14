import { Card } from "@/components/ui/card";
import Image from "next/image";
import SignUpForm from "./form";

export default function SignUp() {
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
