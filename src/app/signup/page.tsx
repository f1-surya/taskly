import { Card } from "@/components/ui/card";
import Image from "next/image";
import SignUpForm from "./form";

export default function SignUp() {
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
        <SignUpForm />
      </Card>
    </div>
  );
}
