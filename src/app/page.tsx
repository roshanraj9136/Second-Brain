"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Editor from "@/components/editor";
import Sidebar from "@/components/sidebar";
import Dashboard from "@/components/dashboard";
import { CommandMenu } from "@/components/command-menu";

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedNote, setSelectedNote] = useState<any | null>(null);
  const [isNewNote, setIsNewNote] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeFolder, setActiveFolder] = useState<string>("All Notes");
  const [customFolders, setCustomFolders] = useState<string[]>(["Personal", "Work", "Ideas"]);

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
      />
      
      <div className="flex-1 h-screen overflow-hidden relative flex flex-col">
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
