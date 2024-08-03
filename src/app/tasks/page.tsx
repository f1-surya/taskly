import { LassoSelect } from "lucide-react";

export default function Tasks() {
  return (
    <div className="hidden sm:flex self-center w-96 items-center justify-center flex-col gap-4">
      <LassoSelect width={200} height={200} />
      <p>Click a task title to view its details</p>
    </div>
  );
}
