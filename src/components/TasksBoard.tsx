"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  MoreHorizontal,
  Filter,
  Search,
  User,
  Calendar,
  ArrowRight,
  Zap
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "done";
  assignedBy: string;
  agent: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  dueDate?: string;
}

const tasksData: Task[] = [
  {
    id: "1",
    title: "Build Mission Control Dashboard",
    description: "Create comprehensive dashboard for OpenClaw agent management",
    status: "in-progress",
    assignedBy: "Ferry",
    agent: "Friday",
    priority: "high",
    createdAt: "2026-02-19",
    dueDate: "2026-02-20",
  },
  {
    id: "2",
    title: "Content Calendar Optimization",
    description: "Optimize Threads posting schedule for @cekhargadisini",
    status: "in-progress",
    assignedBy: "Ferry",
    agent: "Jarvis",
    priority: "high",
    createdAt: "2026-02-19",
    dueDate: "2026-02-21",
  },
  {
    id: "3",
    title: "Notion Progress Sync",
    description: "Auto-update Notion tasks with current progress",
    status: "done",
    assignedBy: "System",
    agent: "Yuri",
    priority: "medium",
    createdAt: "2026-02-18",
  },
  {
    id: "4",
    title: "Agent Health Monitoring",
    description: "Monitor all agents and report status",
    status: "in-progress",
    assignedBy: "System",
    agent: "Yuri",
    priority: "medium",
    createdAt: "2026-02-19",
  },
  {
    id: "5",
    title: "Memory Archive Cleanup",
    description: "Archive old conversation memories",
    status: "pending",
    assignedBy: "Ferry",
    agent: "Glass",
    priority: "low",
    createdAt: "2026-02-19",
  },
  {
    id: "6",
    title: "API Integration Testing",
    description: "Test OpenClaw gateway API endpoints",
    status: "pending",
    assignedBy: "Ferry",
    agent: "Epstein",
    priority: "medium",
    createdAt: "2026-02-18",
  },
];

interface TasksBoardProps {
  compact?: boolean;
}

export default function TasksBoard({ compact = false }: TasksBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "done">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === "all" || task.status === filter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.agent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-amber-400" />;
      default:
        return <Circle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getAgentColor = (agent: string) => {
    const colors: Record<string, string> = {
      Jarvis: "bg-purple-500/10 text-purple-400",
      Friday: "bg-blue-500/10 text-blue-400",
      Glass: "bg-emerald-500/10 text-emerald-400",
      Epstein: "bg-orange-500/10 text-orange-400",
      Yuri: "bg-rose-500/10 text-rose-400",
    };
    return colors[agent] || "bg-slate-500/10 text-slate-400";
  };

  if (compact) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-slate-100">Tasks</h2>
          </div>
          <span className="text-xs text-slate-500">
            {tasks.filter((t) => t.status !== "done").length} active
          </span>
        </div>
        <div className="space-y-2">
          {tasks.slice(0, 4).map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              {getStatusIcon(task.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 truncate">{task.title}</p>
                <p className="text-xs text-slate-500">{task.agent}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
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
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            {["all", "pending", "in-progress", "done"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1.5 rounded-md text-sm capitalize transition-colors ${
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
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pending */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Pending
            </h3>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
              {filteredTasks.filter((t) => t.status === "pending").length}
            </span>
          </div>
          {filteredTasks
            .filter((t) => t.status === "pending")
            .map((task) => (
              <div
                key={task.id}
                className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-200">{task.title}</h4>
                  <MoreHorizontal className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-slate-500 mb-3">{task.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getAgentColor(
                        task.agent
                      )}`}
                    >
                      {task.agent}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <User className="w-3 h-3" />
                    {task.assignedBy}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* In Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
              In Progress
            </h3>
            <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full">
              {filteredTasks.filter((t) => t.status === "in-progress").length}
            </span>
          </div>
          {filteredTasks
            .filter((t) => t.status === "in-progress")
            .map((task) => (
              <div
                key={task.id}
                className="bg-slate-900 border border-amber-500/20 rounded-lg p-4 hover:border-amber-500/40 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-200">{task.title}</h4>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-sm text-slate-500 mb-3">{task.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getAgentColor(
                        task.agent
                      )}`}
                    >
                      {task.agent}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {task.dueDate}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Done */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
              Done
            </h3>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
              {filteredTasks.filter((t) => t.status === "done").length}
            </span>
          </div>
          {filteredTasks
            .filter((t) => t.status === "done")
            .map((task) => (
              <div
                key={task.id}
                className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 opacity-75"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-400 line-through">
                    {task.title}
                  </h4>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getAgentColor(
                      task.agent
                    )}`}
                  >
                    {task.agent}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
