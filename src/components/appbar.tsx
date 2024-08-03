import { getSession, logout } from "@/lib/auth";
import { ExitIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default async function AppBar() {
  const session = await getSession();
  const names = session!.name.split(" ");

  return (
    <div className="hidden sm:flex flex-col items-center justify-between p-4 shadow-md bg-secondary">
      <div className="flex items-center gap-4 justify-start">
        <Image src="/logo.svg" alt="Logo" width={40} height={40} />
      </div>
      <div className="flex justify-center items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarFallback>{names[0][0] + names[1][0]}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <form action={logout}>
                <button type="submit" className="flex items-center gap-2">
                  <ExitIcon color="black" /> Logout
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
