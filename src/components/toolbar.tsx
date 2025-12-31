"use client";

import { type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered,
  Quote,
  CheckSquare
} from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const runCommand = (e: React.MouseEvent, command: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    command();
  };

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 p-2 flex flex-wrap gap-1 bg-zinc-50 dark:bg-zinc-900 rounded-t-lg sticky top-0 z-10">
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onMouseDown={(e) => runCommand(e, () => editor.chain().focus().toggleBold().run())}
        className={editor.isActive("bold") ? "bg-zinc-200 dark:bg-zinc-700" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"}
      >
        <Bold className="w-4 h-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onMouseDown={(e) => runCommand(e, () => editor.chain().focus().toggleItalic().run())}
        className={editor.isActive("italic") ? "bg-zinc-200 dark:bg-zinc-700" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"}
      >
        <Italic className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        type="button"
        onMouseDown={(e) => runCommand(e, () => editor.chain().focus().toggleStrike().run())}
        className={editor.isActive("strike") ? "bg-zinc-200 dark:bg-zinc-700" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"}
      >
        <Strikethrough className="w-4 h-4" />
      </Button>

      <div className="w-[1px] h-6 bg-zinc-300 dark:bg-zinc-700 mx-1 self-center" />

      <Button
        variant="ghost"
        size="sm"
        type="button"
        onMouseDown={(e) => runCommand(e, () => editor.chain().focus().toggleHeading({ level: 1 }).run())}
        className={editor.isActive("heading", { level: 1 }) ? "bg-zinc-200 dark:bg-zinc-700" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"}
      >
        <Heading1 className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        type="button"
        onMouseDown={(e) => runCommand(e, () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
        className={editor.isActive("heading", { level: 2 }) ? "bg-zinc-200 dark:bg-zinc-700" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"}
      >
        <Heading2 className="w-4 h-4" />
      </Button>

      <div className="w-[1px] h-6 bg-zinc-300 dark:bg-zinc-700 mx-1 self-center" />

      <Button
        variant="ghost"
        size="sm"
        type="button"
        onMouseDown={(e) => runCommand(e, () => editor.chain().focus().toggleBulletList().run())}
        className={editor.isActive("bulletList") ? "bg-zinc-200 dark:bg-zinc-700" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"}
      >
        <List className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        type="button"
        onMouseDown={(e) => runCommand(e, () => editor.chain().focus().toggleOrderedList().run())}
        className={editor.isActive("orderedList") ? "bg-zinc-200 dark:bg-zinc-700" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        type="button"
        onMouseDown={(e) => runCommand(e, () => editor.chain().focus().toggleTaskList().run())}
        className={editor.isActive("taskList") ? "bg-zinc-200 dark:bg-zinc-700" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"}
      >
        <CheckSquare className="w-4 h-4" />
      </Button>

      <div className="w-[1px] h-6 bg-zinc-300 dark:bg-zinc-700 mx-1 self-center" />

      <Button
        variant="ghost"
        size="sm"
        type="button"
        onMouseDown={(e) => runCommand(e, () => editor.chain().focus().toggleCodeBlock().run())}
        className={editor.isActive("codeBlock") ? "bg-zinc-200 dark:bg-zinc-700" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"}
      >
        <Code className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        type="button"
        onMouseDown={(e) => runCommand(e, () => editor.chain().focus().toggleBlockquote().run())}
        className={editor.isActive("blockquote") ? "bg-zinc-200 dark:bg-zinc-700" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"}
      >
        <Quote className="w-4 h-4" />
      </Button>
    </div>
  );
}
