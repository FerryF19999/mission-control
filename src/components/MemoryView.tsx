"use client";

import { useState } from "react";
import {
  Brain,
  Search,
  FileText,
  Clock,
  Bot,
  ChevronRight,
  FolderOpen,
  MessageSquare,
  Calendar,
  Filter
} from "lucide-react";

interface MemoryFile {
  id: string;
  name: string;
  agent: string;
  date: string;
  size: string;
  type: "conversation" | "task" | "system";
  preview: string;
}

const memoryData: MemoryFile[] = [
  {
    id: "1",
    name: "2026-02-19.md",
    agent: "Friday",
    date: "2026-02-19",
    size: "12 KB",
    type: "conversation",
    preview: "Building Mission Control dashboard for OpenClaw agents...",
  },
  {
    id: "2",
    name: "2026-02-18.md",
    agent: "Jarvis",
    date: "2026-02-18",
    size: "8 KB",
    type: "task",
    preview: "Optimized content calendar for Threads posting...",
  },
  {
    id: "3",
    name: "2026-02-17.md",
    agent: "Yuri",
    date: "2026-02-17",
    size: "15 KB",
    type: "conversation",
    preview: "Agent monitoring session - all systems operational...",
  },
  {
    id: "4",
    name: "MEMORY.md",
    agent: "Friday",
    date: "2026-02-15",
    size: "24 KB",
    type: "system",
    preview: "Long-term memory storage for Friday agent...",
  },
  {
    id: "5",
    name: "2026-02-16.md",
    agent: "Glass",
    date: "2026-02-16",
    size: "6 KB",
    type: "conversation",
    preview: "Memory archive cleanup completed...",
  },
  {
    id: "6",
    name: "2026-02-14.md",
    agent: "Epstein",
    date: "2026-02-14",
    size: "10 KB",
    type: "task",
    preview: "API integration testing results...",
  },
];

interface MemoryViewProps {
  compact?: boolean;
}

export default function MemoryView({ compact = false }: MemoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<MemoryFile | null>(null);
  const [filter, setFilter] = useState<"all" | "conversation" | "task" | "system">("all");

  const filteredFiles = memoryData.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.agent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || file.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "conversation":
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case "task":
        return <FileText className="w-4 h-4 text-amber-400" />;
      case "system":
        return <Brain className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const getAgentColor = (agent: string) => {
    const colors: Record<string, string> = {
      Jarvis: "text-purple-400",
      Friday: "text-blue-400",
      Glass: "text-emerald-400",
      Epstein: "text-orange-400",
      Yuri: "text-rose-400",
    };
    return colors[agent] || "text-slate-400";
  };

  if (compact) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-slate-100">Memory</h2>
          </div>
          <span className="text-xs text-slate-500">{memoryData.length} files</span>
        </div>
        <div className="space-y-2">
          {memoryData.slice(0, 4).map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer"
              onClick={() => setSelectedFile(file)}
            >
              {getTypeIcon(file.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 truncate">{file.name}</p>
                <p className={`text-xs ${getAgentColor(file.agent)}`}>{file.agent}</p>
              </div>
              <span className="text-xs text-slate-500">{file.size}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            {["all", "conversation", "task", "system"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1.5 rounded-md text-xs capitalize transition-colors ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FolderOpen className="w-4 h-4" />
          <span>/root/.openclaw/memory/</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File List */}
        <div className="lg:col-span-1 space-y-2">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedFile?.id === file.id
                  ? "bg-blue-600/10 border-blue-600/30"
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(file.type)}
                  <span className="font-medium text-slate-200">{file.name}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-2 line-clamp-2">
                {file.preview}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className={getAgentColor(file.agent)}>{file.agent}</span>
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-3 h-3" />
                  {file.date}
                  <span className="text-slate-600">|</span>
                  {file.size}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* File Content */}
        <div className="lg:col-span-2">
          {selectedFile ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  {getTypeIcon(selectedFile.type)}
                  <div>
                    <h3 className="font-medium text-slate-200">
                      {selectedFile.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedFile.agent} • {selectedFile.date} •{" "}
                      {selectedFile.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
                    Export
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
                    Archive
                  </button>
                </div>
              </div>
              <div className="p-4 max-h-[500px] overflow-auto">
                <div className="prose prose-invert prose-sm max-w-none">
                  <pre className="bg-slate-950 p-4 rounded-lg text-slate-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                    {`# Memory Log - ${selectedFile.date}

## Agent: ${selectedFile.agent}
## Type: ${selectedFile.type}

---

${selectedFile.preview}

This is a preview of the memory file content. In the full implementation,
this would display the actual markdown content from the memory file.

### Key Points:
- Task initiated by ${selectedFile.agent}
- Status: Completed
- Duration: ~2 hours
- Output: Successful

### Context:
The agent was working on the assigned task with full context from
previous conversations and system state.

### Next Steps:
- Continue monitoring
- Archive when complete
- Update related tasks

---

Logged at: ${selectedFile.date}T14:30:00Z`}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-slate-900 border border-slate-800 rounded-xl">
              <div className="text-center">
                <Brain className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500">Select a memory file to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
