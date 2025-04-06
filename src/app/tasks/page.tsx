import { auth } from "auth";
import { LassoSelect } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Tasks() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="hidden sm:flex self-center w-full h-screen items-center justify-center flex-col gap-4">
      <LassoSelect width={200} height={200} />
      <p>Click a task title to view its details</p>
    </div>
  );
}
