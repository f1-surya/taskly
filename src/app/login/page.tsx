import { Card } from "@/components/ui/card";
import Image from "next/image";
import LoginForm from "./LoginForm";

export default function Login() {
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
