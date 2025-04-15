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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const boards = [
  { id: "kfldloldmv-90dklsco", name: "Taskly", isPinned: true },
  { id: "kfldloldmv-90dkllelmd", name: "Collection ledger", isPinned: true },
  { id: "kfldloldmv-90dklscoldleld", name: "Chores", isPinned: false },
  { id: "kfldloldmv-90dklscoldlele", name: "FD", isPinned: false },
  { id: "kfldloldmv-90dklled", name: "Dev server", isPinned: false },
  { id: "kfldloldmv-90dklle", name: "Projects", isPinned: false },
];

export function AppSidebar() {
  const pinned = boards.filter((board) => board.isPinned);
  const unpinned = boards.filter((board) => !board.isPinned);
  const isLoading = false;

  return (
    <Sidebar>
      <SidebarHeader />
      {isLoading && (
        <SidebarMenu>
          {Array.from({ length: 5 }).map((_, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuSkeleton />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      )}
      <SidebarContent>
        {pinned.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Pinned</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {pinned.map((board) => (
                  <SidebarMenuItem key={board.id}>
                    <SidebarMenuButton asChild>
                      <a href={`/boards/${board.id}`}>{board.name}</a>
                    </SidebarMenuButton>
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
                    <SidebarMenuButton asChild>
                      <a href={`/boards/${board.id}`}>{board.name}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <Dialog>
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
                <Input id="board-name" placeholder="Enter board name" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Create Board</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}
