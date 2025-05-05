import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Create and manage your tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <footer className="w-full border-t py-6">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Boardit. All rights reserved.
            </p>
          </footer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
