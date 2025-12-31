"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { X } from "lucide-react";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

interface GraphProps {
  notes: any[];
  onClose: () => void;
  onSelectNote: (note: any) => void;
}

export default function KnowledgeGraph({ notes, onClose, onSelectNote }: GraphProps) {
  const { theme } = useTheme();
  const [dimensions, setDimensions] = useState({ w: 800, h: 600 });

  useEffect(() => {
    setDimensions({
      w: window.innerWidth,
      h: window.innerHeight,
    });

    const handleResize = () => {
      setDimensions({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const data = useMemo(() => {
    const nodes = notes.map((note) => {
      const firstNode = note.content?.content?.[0];
      let title = "Untitled";
      if (firstNode && firstNode.type === 'heading' && firstNode.attrs?.level === 1) {
        title = firstNode.content?.[0]?.text || "Untitled";
      }
      return { id: note.id, name: title, val: 1 };
    });

    const links: any[] = [];
    
    notes.forEach((sourceNote) => {
      const sourceContent = JSON.stringify(sourceNote.content).toLowerCase();
      
      notes.forEach((targetNote) => {
        if (sourceNote.id === targetNote.id) return;

        const firstNode = targetNote.content?.content?.[0];
        let targetTitle = "";
        if (firstNode && firstNode.type === 'heading' && firstNode.attrs?.level === 1) {
          targetTitle = firstNode.content?.[0]?.text || "";
        }

        if (targetTitle && sourceContent.includes(targetTitle.toLowerCase())) {
          links.push({
            source: sourceNote.id,
            target: targetNote.id,
          });
        }
      });
    });

    return { nodes, links };
  }, [notes]);

  return (
    <div className="fixed inset-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm flex items-center justify-center">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors z-50"
      >
        <X className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
      </button>

      <div className="w-full h-full cursor-move">
        <ForceGraph2D
          width={dimensions.w}
          height={dimensions.h}
          graphData={data}
          nodeLabel="name"
          nodeColor={() => theme === "dark" ? "#a78bfa" : "#7c3aed"} 
          linkColor={() => theme === "dark" ? "#52525b" : "#d4d4d8"}
          backgroundColor="rgba(0,0,0,0)"
          nodeRelSize={6}
          linkWidth={2}
          onNodeClick={(node: any) => {
            const selected = notes.find(n => n.id === node.id);
            if (selected) {
              onSelectNote(selected);
              onClose();
            }
          }}
          cooldownTicks={100}
        />
      </div>
      
      <div className="absolute bottom-10 left-10 pointer-events-none">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Knowledge Graph</h2>
        <p className="text-zinc-500">
          {data.nodes.length} Notes • {data.links.length} Connections
        </p>
      </div>
    </div>
  );
}
