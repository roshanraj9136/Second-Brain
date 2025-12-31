"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useEffect, useState } from "react";
import { FileText, Plus, Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";

interface CommandMenuProps {
  notes: any[];
  onSelectNote: (note: any) => void;
  onCreateNew: () => void;
}

export function CommandMenu({ notes, onSelectNote, onCreateNew }: CommandMenuProps) {
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const getTitle = (content: any) => {
    try {
      const heading = content?.content?.find((block: any) => block.type === 'heading');
      if (heading) return heading.content?.[0]?.text || "Untitled";
      const paragraph = content?.content?.find((block: any) => block.type === 'paragraph');
      return paragraph?.content?.[0]?.text || "Untitled Note";
    } catch { return "Untitled Note"; }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      {open && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto" onClick={() => setOpen(false)} />
      )}
      
      {open && (
        <div className="pointer-events-auto w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200">
           <Command label="Command Menu" loop>
            <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800 px-3">
              <Command.Input placeholder="Type a command or search..." />
            </div>
            
            <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
              <Command.Empty className="py-6 text-center text-sm text-zinc-500">
                No results found.
              </Command.Empty>

              <Command.Group heading="Actions">
                <Command.Item
                  onSelect={() => {
                    onCreateNew();
                    setOpen(false);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Note</span>
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Notes">
                {notes.map((note) => (
                  <Command.Item
                    key={note.id}
                    onSelect={() => {
                      onSelectNote(note);
                      setOpen(false);
                    }}
                  >
                    <FileText className="w-4 h-4" />
                    <span>{getTitle(note.content)}</span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading="Theme">
                <Command.Item onSelect={() => setTheme("light")}>
                  <Sun className="w-4 h-4" /> Light
                </Command.Item>
                <Command.Item onSelect={() => setTheme("dark")}>
                  <Moon className="w-4 h-4" /> Dark
                </Command.Item>
                <Command.Item onSelect={() => setTheme("system")}>
                  <Laptop className="w-4 h-4" /> System
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      )}
    </div>
  );
}
