import {Card} from "@/components/ui/card";
import Image from "next/image";
import LoginForm from "./LoginForm";

export default function Login() {
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
        <LoginForm />
      </Card>
    </main>
  );
}
