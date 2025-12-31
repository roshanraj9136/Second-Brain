"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Toolbar from "./toolbar";
import { Loader2, Save, ChevronLeft, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EditorProps {
  note: any | null;
  folder: string;
  onSaveSuccess: () => void;
  onBack: () => void;
}

export default function Editor({ note, folder, onSaveSuccess, onBack }: EditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Type your genius ideas here...",
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-xl prose-zinc dark:prose-invert max-w-7xl w-full focus:outline-none min-h-[800px] bg-white dark:bg-zinc-950 shadow-sm border border-zinc-200 dark:border-zinc-800 p-16 rounded-3xl mx-auto my-8 text-lg leading-loose",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;

    if (note) {
      const fullContent = note.content || { type: 'doc', content: [] };
      const nodes = fullContent.content || [];
      const firstNode = nodes[0];

      let extractedTitle = "";
      let bodyNodes = nodes;

      if (firstNode && firstNode.type === 'heading' && firstNode.attrs?.level === 1) {
        extractedTitle = firstNode.content?.[0]?.text || "";
        bodyNodes = nodes.slice(1);
      } else {
        extractedTitle = "Untitled Note";
      }

      setTitle(extractedTitle);
      
      editor.commands.setContent({
        type: 'doc',
        content: bodyNodes
      });

    } else {
      setTitle("");
      editor.commands.clearContent();
    }
  }, [note, editor]);

  const handleSave = async () => {
    if (!editor) return;
    setIsSaving(true);

    const bodyJson = editor.getJSON();
    
    const finalContent = {
      type: 'doc',
      folder: note?.content?.folder || folder, 
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: title || "Untitled Note" }]
        },
        ...(bodyJson.content || [])
      ]
    };

    if (note?.id) {
      await supabase.from("notes").update({ content: finalContent }).eq("id", note.id);
    } else {
      await supabase.from("notes").insert({ content: finalContent });
    }

    setIsSaving(false);
    onSaveSuccess();
    toast.success("Saved to database");
  };

  return (
    <div className="w-full flex flex-col h-screen overflow-hidden bg-zinc-50 dark:bg-black">
      
      <div className="flex justify-between items-center py-5 px-8 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-20 sticky top-0">
        
        <div className="flex items-center gap-6 w-full mr-4">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full h-10 px-4 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </Button>
          
          <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800"></div>

          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
               <Folder className="w-3 h-3" />
               {note?.content?.folder || folder}
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 bg-transparent border-none outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
              placeholder="Untitled Document"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 min-w-[120px] h-10 rounded-full font-bold shadow-xl shadow-zinc-500/10 transition-all hover:scale-105"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex justify-center py-3 shadow-sm z-10">
         <div className="max-w-7xl w-full px-16">
            <Toolbar editor={editor} />
         </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-zinc-50/50 dark:bg-black p-6 scrollbar-hide">
        <EditorContent editor={editor} />
      </div>

    </div>
  );
}
