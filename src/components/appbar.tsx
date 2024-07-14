import Image from "next/image";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { logout } from "@/lib/auth";
import { ExitIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Props {
  name: string;
}

export default function AppBar({ name }: Props) {
  const names = name.split(" ");

  return (
    <div className="flex items-center justify-between w-full p-4 shadow-md bg-secondary">
      <div className="flex items-center gap-4 justify-start">
        <Image src="/logo.svg" alt="Logo" width={50} height={50} />
        <h1 className="text-2xl font-semibold text-white">Task Manager</h1>
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
