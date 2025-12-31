"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { LogOut, Loader2, Chrome } from "lucide-react";
import { useState } from "react";

interface AuthButtonProps {
  user: any;
}

export function AuthButton({ user }: AuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (user) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLogout}
        className="text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-xs h-9 px-4 rounded-full"
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <LogOut className="w-3 h-3 mr-2" />}
        Sign Out
      </Button>
    );
  }

  return (
    <Button 
      variant="default" 
      size="sm" 
      onClick={handleLogin}
      disabled={loading}
      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/20 h-9 px-4 rounded-full transition-all hover:scale-105"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Chrome className="w-4 h-4" />
      )}
      Connect Google
    </Button>
  );
}
