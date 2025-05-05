import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="flex flex-col items-center max-w-md">
          <div className="flex items-center justify-center rounded-full bg-muted p-4 mb-6">
            eAlertCircle className="text-muted-foreground h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Board not found</h1>
          <p className="text-muted-foreground mb-8">
            The board you are looking for does not exist or may have been
            deleted.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/boards">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to boards</span>
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
