import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { auth, signIn } from "auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | Boardit",
};

export default async function Login() {
  const session = await auth();
  if (session?.user) {
    redirect("/boards");
  }

  return (
    <main className="flex flex-1 w-full items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>Login to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <Button
              variant="outline"
              className="w-full relative overflow-hidden"
            >
              <GitHubLogoIcon />
              <span>Sign in with Github</span>
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-muted-foreground text-sm">
            By using Boardit, you agree to our Terms of Service
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
