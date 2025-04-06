import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  return <main className="flex min-h-screen flex-row w-full">{children}</main>;
}
