import { AppSidebar } from "@/components/app-sidebar";
import ThemeToggle from "@/components/theme-toggle";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const cookieJar = await cookies();
  const defaultOpen = cookieJar.get("sidebar_state")?.value === "true";
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <div className="flex flex-col w-full">
        <header className="sticky top-0 z-50 w-full h-16 p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between">
          <SidebarTrigger />
          <h1 className="font-bold text-2xl">BoardIt</h1>
          <div className="flex flex-row items-center gap-4">
            <ThemeToggle />
            <Avatar>
              <AvatarImage src={session.user.image!} alt="User image" />
            </Avatar>
          </div>
        </header>
        {children}
      </div>
    </SidebarProvider>
  );
}
