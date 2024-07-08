import Image from "next/image";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { logout } from "@/lib/auth";
import { ExitIcon } from "@radix-ui/react-icons";

interface Props {
  name: string;
}

export default function AppBar({ name }: Props) {
  const names = name.split(" ");

  return (
    <div className="flex items-center justify-between w-full p-4 shadow-md bg-secondary">
      <div className="flex items-center gap-4 justify-start">
        <Image src="/logo.svg" alt="Logo" width={50} height={50} />
        <h1 className="text-3xl font-semibold text-white">Task Manager</h1>
      </div>
      <div className="flex justify-center items-center gap-2">
        <Avatar>
          <AvatarFallback>{names[0][0] + names[1][0]}</AvatarFallback>
        </Avatar>
        <form
          action={async () => {
            "use server";
            await logout();
          }}
        >
          <button className="bg-white rounded-3xl p-3" type="submit">
            <ExitIcon color="black" />
          </button>
        </form>
      </div>
    </div>
  );
}
