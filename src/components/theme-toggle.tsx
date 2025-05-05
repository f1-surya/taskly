"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  function toggle() {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }
  return (
    <Button size="icon" onClick={toggle}>
      {resolvedTheme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
