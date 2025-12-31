"use client";

import { Button } from "@/components/ui/button";
import { Plus, Clock, FileText, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AuthButton } from "./auth-button";
import { ModeToggle } from "@/components/mode-toggle";

interface DashboardProps {
  notes: any[];
  user: any;
  onCreateNew: () => void;
  onSelectNote: (note: any) => void;
}

export default function Dashboard({ notes, user, onCreateNew, onSelectNote }: DashboardProps) {
  const recentNotes = notes.slice(0, 3);
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || "Creator";

  const getTitle = (content: any) => {
    try {
      const heading = content?.content?.find((block: any) => block.type === 'heading');
      if (heading) return heading.content?.[0]?.text || "Untitled";
      return "Untitled Note";
    } catch { return "Untitled Note"; }
  };

  return (
    <div className="h-screen w-full bg-zinc-50 dark:bg-black p-4 md:p-8 overflow-y-auto flex flex-col relative selection:bg-purple-500/20">
      
      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2 md:gap-4 p-2 md:p-3 md:pl-5 md:pr-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-full border border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 z-50 animate-in fade-in slide-in-from-top-4 duration-1000 hover:scale-[1.02] transition-transform">
        
        <div className="hidden md:flex items-center gap-3 mr-2 text-zinc-400 border-r border-zinc-200 dark:border-zinc-800 pr-4 py-1">
          <span className="text-xs font-semibold tracking-wide">SEARCH</span>
          <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 font-mono text-[10px] font-bold text-zinc-500 dark:text-zinc-400 opacity-100 shadow-sm">
            <span className="text-xs">Ctrl</span> K
          </kbd>
        </div>

        <div className="transform hover:scale-110 transition-transform duration-200">
           <ModeToggle />
        </div>
        <AuthButton user={user} />
      </div>

      <div className="max-w-4xl w-full mx-auto mt-16 md:mt-24 space-y-12 md:space-y-16 animate-in fade-in zoom-in-95 duration-1000 relative z-10">
        
        <div className="text-center space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-full border border-purple-100 dark:border-purple-800/30 mb-2 shadow-sm hover:shadow-md transition-shadow cursor-default">
             <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
             <span className="text-[11px] font-bold text-purple-600 dark:text-purple-300 uppercase tracking-widest">Second Brain v2.0</span>
          </div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 drop-shadow-sm">
            {timeOfDay}, <br />
            <span className="text-zinc-300 dark:text-zinc-600">{userName}.</span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl max-w-md mx-auto font-medium leading-relaxed px-4">
            Capture ideas, manage projects, and organize your life in one beautiful place.
          </p>
        </div>

        <div className="flex justify-center">
          <button 
            onClick={onCreateNew}
            className="group relative w-full max-w-xl h-56 md:h-72 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-6 md:gap-8 ring-1 ring-zinc-900/5 dark:ring-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative p-5 md:p-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl shadow-inner group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
              <Plus className="w-10 h-10 md:w-12 md:h-12 text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-500" />
            </div>
            
            <div className="relative text-center space-y-2">
               <span className="block text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Create New Project</span>
               <span className="block text-sm md:text-base text-zinc-400 font-medium group-hover:translate-y-1 transition-transform">Start a blank page</span>
            </div>
          </button>
        </div>

        {recentNotes.length > 0 && (
          <div className="max-w-2xl mx-auto space-y-5 pt-8 md:pt-12 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-200 pb-8">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-zinc-100 dark:border-zinc-800/50">
               <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                 <Clock className="w-3 h-3" /> Recently Edited
               </div>
               <Button variant="link" className="text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 h-auto p-0 transition-colors">View All</Button>
            </div>
            
            <div className="grid gap-3">
              {recentNotes.map((note) => (
                <div 
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  className="group flex items-center justify-between p-4 md:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-black/20 cursor-pointer transition-all duration-300 hover:-translate-x-1"
                >
                  <div className="flex items-center gap-4 md:gap-5">
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-400 group-hover:text-purple-500 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-all duration-300 group-hover:scale-110">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate max-w-[180px] md:max-w-xs">
                        {getTitle(note.content)}
                      </h3>
                      <p className="text-xs text-zinc-400 font-medium mt-1">
                        {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-zinc-300 dark:text-zinc-700 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 ease-out hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
