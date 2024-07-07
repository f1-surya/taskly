import Image from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";

export default function AppBar() {
  return (
    <div className="flex items-center justify-between w-full p-4 shadow-md bg-secondary">
      <div className="flex items-center gap-4 justify-start">
        <Image src="/logo.svg" alt="Logo" width={50} height={50} />
        <h1 className="text-3xl font-semibold text-white">Task Manager</h1>
      </div>
      <Avatar>
        <AvatarImage />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  );
}