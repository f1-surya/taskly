import ThemeToggle from "@/components/theme-toggle";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { auth } from "auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col w-full">
      <header className="sticky top-0 z-50 w-full h-16 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between">
        <h1 className="font-bold text-2xl">Taskly</h1>
        <div className="flex flex-row items-center gap-4">
          <ThemeToggle />
          <Avatar>
            <AvatarImage src={session.user.image!} alt="User image" />
          </Avatar>
        </div>
      </header>
      {children}
    </main>
  );
}
