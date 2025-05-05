"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { fetcher } from "@/lib/utils";
import { CirclePlus, Pin, PinOff } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export function AppSidebar() {
  const { data: userBoards, isLoading, mutate } = useSWR("/api/board", fetcher);
  const [boardName, setBoardName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { board: boardId } = useParams<{ board: string }>();
  const router = useRouter();

  const pinned = userBoards?.filter((board) => board.isPinned);
  const unpinned = userBoards?.filter((board) => !board.isPinned);

  const handleCreate = async () => {
    if (boardName.length === 0) {
      toast.error("Please enter a board name");
      return;
    }
    const response = await fetch("/api/board", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: boardName.trim(),
      }),
    });
    if (response.ok) {
      setBoardName("");
      setDialogOpen(false);
      const board = await response.json();
      mutate([...userBoards, board]);
      router.push(`/boards/${board.id}`);
    } else {
      toast.error("Failed to create board");
    }
  };

  const handlePin = async (boardId: number, isPinned: boolean) => {
    const response = await fetch(`/api/board?id=${boardId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isPinned,
      }),
    });
    if (response.ok) {
      const board = await response.json();
      mutate((boards) => boards.map((b) => (b.id === boardId ? board : b)));
    } else {
      const error = await response.json();
      toast.error(error.message);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader />
      {isLoading ? (
        <SidebarMenu>
          {Array.from({ length: 5 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuSkeleton />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      ) : (
        <SidebarContent>
          {pinned.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Pinned</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {pinned.map((board) => (
                    <SidebarMenuItem key={board.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={board.id === parseInt(boardId)}
                      >
                        <Link href={`/boards/${board.id}`}>{board.name}</Link>
                      </SidebarMenuButton>
                      <SidebarMenuAction
                        onClick={() => handlePin(board.id, false)}
                      >
                        <PinOff />
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          {unpinned.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Unpinned</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {unpinned.map((board) => (
                    <SidebarMenuItem key={board.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={board.id === parseInt(boardId)}
                      >
                        <Link href={`/boards/${board.id}`}>{board.name}</Link>
                      </SidebarMenuButton>
                      <SidebarMenuAction
                        onClick={() => handlePin(board.id, true)}
                      >
                        <Pin />
                      </SidebarMenuAction>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
      )}
      <SidebarFooter>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <CirclePlus />
              New board
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Board</DialogTitle>
            </DialogHeader>{" "}
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="board-name">Board Name</Label>
                <Input
                  id="board-name"
                  placeholder="Enter board name"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleCreate}>Create Board</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}
