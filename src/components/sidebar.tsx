"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, FileText, Search, Folder, FolderOpen, LayoutGrid, Settings, ChevronRight, ChevronDown, AlertCircle, X, PanelLeftClose, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { isToday, isYesterday } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { toast } from "sonner";

interface SidebarProps {
  notes: any[];
  selectedNote: any | null;
  onSelectNote: (note: any) => void;
  onCreateNew: () => void;
  onDeleteNote: (id: string) => void;
  activeFolder: string;         
  onFolderChange: (f: string) => void; 
  customFolders: string[];
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (name: string) => void;
  user: any;
  isOpen: boolean;
  onClose: () => void;
  isDesktopOpen: boolean;
  onDesktopToggle: () => void;
}

export default function Sidebar({
  notes,
  selectedNote,
  onSelectNote,
  onCreateNew,
  onDeleteNote,
  activeFolder,
  onFolderChange,
  customFolders,
  onCreateFolder,
  onDeleteFolder,
  user,
  isOpen,
  onClose,
  isDesktopOpen,
  onDesktopToggle
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const [newFolderName, setNewFolderName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setTheme } = useTheme();

  const handleNoteClick = (note: any) => {
    onSelectNote(note);
    if (window.innerWidth < 768) {
        onClose();
    }
  };

  const getTitle = (content: any) => {
    try {
      const heading = content?.content?.find((block: any) => block.type === 'heading');
      if (heading) return heading.content?.[0]?.text || "Untitled";
      return "Untitled Note";
    } catch { return "Untitled Note"; }
  };

  const getFolder = (note: any) => {
    return note.content?.folder || "All Notes";
  };

  let filtered = notes.filter((note) => {
    const title = getTitle(note.content).toLowerCase();
    const matchesSearch = title.includes(searchTerm.toLowerCase());
    
    if (activeFolder === "All Notes") return matchesSearch;
    return matchesSearch && getFolder(note) === activeFolder;
  });

  const grouped = {
    today: filtered.filter(n => isToday(new Date(n.created_at))),
    yesterday: filtered.filter(n => isYesterday(new Date(n.created_at))),
    older: filtered.filter(n => !isToday(new Date(n.created_at)) && !isYesterday(new Date(n.created_at)))
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      toast.success(`Folder "${newFolderName}" created`);
      setNewFolderName("");
      setDialogOpen(false);
    }
  };

  const NoteItem = ({ note }: { note: any }) => {
    const title = getTitle(note.content) || "Untitled Note";
    return (
      <div
        className={cn(
          "group flex items-center justify-between p-3 mb-1 rounded-lg text-[15px] cursor-pointer transition-all duration-200 border",
          selectedNote?.id === note.id 
            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm border-zinc-200 dark:border-zinc-700" 
            : "border-transparent text-zinc-600 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 dark:text-zinc-400"
        )}
        onClick={() => handleNoteClick(note)}
      >
        <div className="flex items-center gap-3 overflow-hidden pointer-events-none">
          <FileText className={cn("w-4 h-4 flex-shrink-0 transition-colors", selectedNote?.id === note.id ? "text-purple-600" : "text-zinc-400")} />
          <span className="truncate">{title}</span>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-500 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Note?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{title}". You cannot undo this action.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                  toast.success("Note deleted");
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  return (
    <>
    {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
    )}

    <div className={cn(
        "fixed inset-y-0 left-0 z-50 border-r border-zinc-200 dark:border-zinc-800 h-[100dvh] flex flex-col bg-zinc-50/95 dark:bg-black/95 backdrop-blur-xl transition-all duration-300 ease-in-out shadow-2xl md:shadow-none",
        "md:relative md:translate-x-0",
        isOpen ? "translate-x-0 w-80" : "-translate-x-full w-80",
        "md:transform-none", 
        isDesktopOpen ? "md:w-80 md:opacity-100" : "md:w-0 md:opacity-0 md:overflow-hidden md:border-none"
    )}>
      
      <div className="p-6 space-y-6 flex-shrink-0 whitespace-nowrap">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 font-bold text-xl tracking-tight px-1 text-zinc-800 dark:text-zinc-100">
            <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="text-white text-lg">⚡</span>
            </div>
            Second Brain
            </div>
            
            <Button variant="ghost" size="icon" className="md:hidden text-zinc-500" onClick={onClose}>
                <X className="w-6 h-6" />
            </Button>

            <Button variant="ghost" size="icon" className="hidden md:flex text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100" onClick={onDesktopToggle}>
                <PanelLeftClose className="w-5 h-5" />
            </Button>
        </div>

        <Button 
          onClick={() => { onCreateNew(); if(window.innerWidth < 768) onClose(); }} 
          className="w-full justify-start gap-3 h-14 text-lg font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-xl shadow-zinc-500/10 rounded-2xl transition-all hover:-translate-y-0.5 cursor-pointer" 
        >
          <Plus className="w-6 h-6" />
          New Note
        </Button>

        <div className="relative group">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400 group-focus-within:text-purple-500 transition-colors" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-base outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden whitespace-nowrap">
        <ScrollArea className="h-full px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between px-1 mb-3 group">
              <div 
                className="flex items-center gap-2 text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                onClick={() => setIsFolderOpen(!isFolderOpen)}
              >
                  {isFolderOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  Collections
              </div>
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-zinc-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-all cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Collection</DialogTitle>
                    <DialogDescription>Create a new folder to organize your thoughts.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4">
                    <Input 
                      placeholder="Folder Name (e.g. Work, Ideas)" 
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="text-lg py-6"
                    />
                    <Button type="submit" className="w-full h-12 text-lg cursor-pointer">Create Folder</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isFolderOpen && (
              <div className="space-y-1">
                <button 
                  onClick={() => { onFolderChange("All Notes"); if(window.innerWidth < 768) onClose(); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-[16px] font-medium rounded-xl transition-all duration-200 cursor-pointer",
                    activeFolder === "All Notes" 
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-700" 
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                  )}
                >
                  <LayoutGrid className="w-5 h-5 text-zinc-400" />
                  All Notes
                </button>

                {customFolders.map((folder) => (
                  <div 
                    key={folder}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                      activeFolder === folder 
                        ? "bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700" 
                        : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                    )}
                    onClick={() => { onFolderChange(folder); if(window.innerWidth < 768) onClose(); }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                        {activeFolder === folder ? (
                          <FolderOpen className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        ) : (
                          <Folder className="w-5 h-5 text-zinc-400 group-hover:text-blue-500/70 transition-colors flex-shrink-0" />
                        )}
                        <span className={cn(
                          "text-[16px] font-medium truncate",
                          activeFolder === folder ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"
                        )}>
                          {folder}
                        </span>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Collection?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{folder}"? The notes inside will not be deleted, they will move to "All Notes".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-600 hover:bg-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteFolder(folder);
                              toast.success(`Collection "${folder}" deleted`);
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {filtered.length === 0 && (
            <div className="text-center py-10 px-4 opacity-50">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
              <p className="text-sm text-zinc-500">No notes in this collection yet.</p>
            </div>
          )}

          {grouped.today.length > 0 && (
            <div className="mb-6">
              <div className="px-3 mb-3 text-xs font-bold text-zinc-400 uppercase tracking-widest">Today</div>
              {grouped.today.map(note => <NoteItem key={note.id} note={note} />)}
            </div>
          )}
          
          {grouped.yesterday.length > 0 && (
            <div className="mb-6">
              <div className="px-3 mb-3 text-xs font-bold text-zinc-400 uppercase tracking-widest">Yesterday</div>
              {grouped.yesterday.map(note => <NoteItem key={note.id} note={note} />)}
            </div>
          )}

          {grouped.older.length > 0 && (
            <div className="mb-6">
              <div className="px-3 mb-3 text-xs font-bold text-zinc-400 uppercase tracking-widest">Older</div>
              {grouped.older.map(note => <NoteItem key={note.id} note={note} />)}
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 flex-shrink-0 whitespace-nowrap">
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex items-center justify-between group cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 p-3 -m-3 rounded-2xl transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white text-base font-bold shadow-md">
                  {user?.email?.[0].toUpperCase() || "G"}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    {user?.user_metadata?.full_name || "Guest User"}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Pro Plan</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer">
                <Settings className="w-6 h-6" />
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>App Settings</DialogTitle>
              <DialogDescription>Manage your preferences and workspace.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Appearance</div>
                  <div className="text-xs text-zinc-500">Toggle light/dark mode</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => setTheme("light")} className="cursor-pointer"><Sun className="w-4 h-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => setTheme("dark")} className="cursor-pointer"><Moon className="w-4 h-4" /></Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">App Version</div>
                  <div className="text-xs text-zinc-500">Pro v2.1 Mobile</div>
                </div>
                <Button variant="secondary" disabled>Up to date</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

    </div>
    </>
  );
}
