"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MarkdownDocument } from "@/lib/use-documents";
import {
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";

interface AppSidebarProps {
  documents: MarkdownDocument[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

function formatUpdatedAt(timestamp: number) {
  const date = new Date(timestamp);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  return isToday
    ? date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function RenameInput({
  initialValue,
  onSubmit,
  onCancel,
}: {
  initialValue: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onSubmit(value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSubmit(value);
        if (e.key === "Escape") onCancel();
      }}
      className="h-8"
    />
  );
}

export function AppSidebar({
  documents,
  activeId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: AppSidebarProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null);

  const sorted = [...documents].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <Button variant="outline" className="justify-start" onClick={onCreate}>
          <PlusIcon className="size-4" data-icon="inline-start" />
          New document
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sorted.map((doc) => (
                <SidebarMenuItem key={doc.id}>
                  {renamingId === doc.id ? (
                    <RenameInput
                      initialValue={doc.title}
                      onSubmit={(title) => {
                        onRename(doc.id, title);
                        setRenamingId(null);
                      }}
                      onCancel={() => setRenamingId(null)}
                    />
                  ) : (
                    <>
                      <SidebarMenuButton
                        isActive={doc.id === activeId}
                        onClick={() => onSelect(doc.id)}
                        className="h-auto py-2"
                      >
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className="truncate font-medium">
                            {doc.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatUpdatedAt(doc.updatedAt)}
                          </span>
                        </span>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover>
                            <MoreHorizontalIcon className="size-4" />
                            <span className="sr-only">Document actions</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem
                            onSelect={() => setRenamingId(doc.id)}
                          >
                            <PencilIcon className="size-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => onDelete(doc.id)}
                          >
                            <Trash2Icon className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
