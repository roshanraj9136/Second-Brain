"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Editor from "@/components/editor";
import Sidebar from "@/components/sidebar";
import Dashboard from "@/components/dashboard";
import { CommandMenu } from "@/components/command-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedNote, setSelectedNote] = useState<any | null>(null);
  const [isNewNote, setIsNewNote] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeFolder, setActiveFolder] = useState<string>("All Notes");
  const [customFolders, setCustomFolders] = useState<string[]>(["Personal", "Work", "Ideas"]);
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const fetchNotes = async () => {
    const { data } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setNotes(data);
  };

  const deleteNote = async (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setIsNewNote(false);
    }
    await supabase.from("notes").delete().eq("id", id);
    fetchNotes();
  };
  
  const handleCreateNew = () => {
    setSelectedNote(null);
    setIsNewNote(true);
  };

  const handleSelectNote = (note: any) => {
    setSelectedNote(note);
    setIsNewNote(false);
  }

  const handleBack = () => {
    setSelectedNote(null);
    setIsNewNote(false);
  };

  const handleCreateFolder = (folderName: string) => {
    if (!customFolders.includes(folderName)) {
      setCustomFolders([...customFolders, folderName]);
    }
  };

  const handleDeleteFolder = (folderName: string) => {
    setCustomFolders((prev) => prev.filter((f) => f !== folderName));
    if (activeFolder === folderName) {
      setActiveFolder("All Notes");
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      fetchNotes();
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchNotes();
      }
    });

    const saved = localStorage.getItem("customFolders");
    if (saved) {
      setCustomFolders(JSON.parse(saved));
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("customFolders", JSON.stringify(customFolders));
  }, [customFolders]);

  const handleToggle = () => {
    if (window.innerWidth < 768) {
      setIsMobileSidebarOpen(true);
    } else {
      setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
    }
  };

  return (
    <main className="flex min-h-screen bg-zinc-50 dark:bg-black text-[16px]">
      <CommandMenu 
        notes={notes} 
        onSelectNote={handleSelectNote} 
        onCreateNew={handleCreateNew} 
      />

      <Sidebar 
        notes={notes} 
        selectedNote={selectedNote} 
        onSelectNote={handleSelectNote}
        onCreateNew={handleCreateNew}
        onDeleteNote={deleteNote}
        activeFolder={activeFolder}
        onFolderChange={setActiveFolder}
        customFolders={customFolders}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        user={user}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        isDesktopOpen={isDesktopSidebarOpen}
        onDesktopToggle={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
      />
      
      <div className="flex-1 h-screen overflow-hidden relative flex flex-col">
        <div className={cn("absolute top-4 left-4 z-30", isDesktopSidebarOpen ? "md:hidden" : "block")}>
            <Button 
                variant="outline" 
                size="icon" 
                className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm rounded-full h-10 w-10 border-zinc-200 dark:border-zinc-800"
                onClick={handleToggle}
            >
                <Menu className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            </Button>
        </div>

        {!selectedNote && !isNewNote ? (
          <Dashboard 
            notes={notes} 
            user={user}
            onCreateNew={handleCreateNew} 
            onSelectNote={handleSelectNote} 
          />
        ) : (
          <Editor 
            key={selectedNote ? selectedNote.id : 'new-note'}
            note={selectedNote} 
            folder={activeFolder === "All Notes" ? "Personal" : activeFolder}
            onSaveSuccess={fetchNotes}
            onBack={handleBack}
          />
        )}
      </div>
    </main>
  );
}
