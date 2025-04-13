import { Board } from "@/components/kanban-board";
import { auth } from "auth";
import { redirect } from "next/navigation";

export default async function Tasks() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="w-full h-screen p-4">
      <Board />
    </div>
  );
}
