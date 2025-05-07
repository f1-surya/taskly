import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "BoardIt",
  description: "Create and manage your tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body className="flex flex-col h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <footer className="border-t py-6">
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
