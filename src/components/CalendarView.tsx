"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  RefreshCw,
  Bot,
  Play,
  Pause,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  CalendarDays
} from "lucide-react";

interface CronJob {
  id: string;
  name: string;
  agent: string;
  schedule: string;
  nextRun: string;
  lastRun: string;
  status: "active" | "paused" | "error";
  lastStatus: "ok" | "error" | "running";
  description: string;
}

const cronJobsData: CronJob[] = [
  {
    id: "1",
    name: "Notion Progress Auto-Update",
    agent: "Yuri",
    schedule: "Every 30 min",
    nextRun: "2026-02-19 17:00",
    lastRun: "2026-02-19 16:30",
    status: "active",
    lastStatus: "ok",
    description: "Update Notion tasks with current progress",
  },
  {
    id: "2",
    name: "Agent Progress Monitor",
    agent: "Yuri",
    schedule: "Every 5 min",
    nextRun: "2026-02-19 16:32",
    lastRun: "2026-02-19 16:27",
    status: "active",
    lastStatus: "ok",
    description: "Monitor all agents and report status",
  },
  {
    id: "3",
    name: "Threads Post - Morning",
    agent: "Jarvis",
    schedule: "0 1 10 2 *",
    nextRun: "2026-02-20 08:00",
    lastRun: "2026-02-19 08:00",
    status: "active",
    lastStatus: "ok",
    description: "Post morning content to Threads",
  },
  {
    id: "4",
    name: "Memory Cleanup",
    agent: "Glass",
    schedule: "0 0 * * *",
    nextRun: "2026-02-20 00:00",
    lastRun: "2026-02-19 00:00",
    status: "paused",
    lastStatus: "ok",
    description: "Archive old conversation memories",
  },
  {
    id: "5",
    name: "Health Check",
    agent: "Epstein",
    schedule: "Every 1 hour",
    nextRun: "2026-02-19 17:00",
    lastRun: "2026-02-19 16:00",
    status: "active",
    lastStatus: "error",
    description: "System health check and reporting",
  },
];

interface CalendarViewProps {
  compact?: boolean;
}

export default function CalendarView({ compact = false }: CalendarViewProps) {
  const [jobs, setJobs] = useState<CronJob[]>(cronJobsData);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case "running":
        return <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getAgentColor = (agent: string) => {
    const colors: Record<string, string> = {
      Jarvis: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      Friday: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Glass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      Epstein: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      Yuri: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    };
    return colors[agent] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
  };

  if (compact) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-slate-100">Scheduled</h2>
          </div>
          <span className="text-xs text-slate-500">
            {jobs.filter((j) => j.status === "active").length} active
          </span>
        </div>
        <div className="space-y-2">
          {jobs.slice(0, 4).map((job) => (
            <div
              key={job.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50"
            >
              {getStatusIcon(job.lastStatus)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 truncate">{job.name}</p>
                <p className="text-xs text-slate-500">{job.schedule}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${getAgentColor(
                  job.agent
                )}`}
              >
                {job.agent}
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                viewMode === "calendar"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {jobs.filter((j) => j.status === "active").length} active jobs
          </span>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-4">
                  Job Name
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-4">
                  Agent
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-4">
                  Schedule
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-4">
                  Next Run
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider p-4">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider p-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-slate-200">{job.name}</p>
                      <p className="text-xs text-slate-500">{job.description}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getAgentColor(
                        job.agent
                      )}`}
                    >
                      {job.agent}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="w-4 h-4" />
                      {job.schedule}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-slate-300">{job.nextRun}</p>
                    <p className="text-xs text-slate-500">Last: {job.lastRun}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.lastStatus)}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          job.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : job.status === "paused"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors">
                        {job.status === "active" ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                      <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="grid grid-cols-7 gap-px bg-slate-800 rounded-lg overflow-hidden">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="bg-slate-900 p-3 text-center text-xs font-semibold text-slate-500"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: 28 }, (_, i) => (
              <div
                key={i}
                className="bg-slate-900 p-3 min-h-[100px] hover:bg-slate-800/50 transition-colors"
              >
                <span className="text-sm text-slate-400">{i + 1}</span>
                {i === 18 && (
                  <div className="mt-1 space-y-1">
                    <div className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded truncate">
                      Notion Sync
                    </div>
                    <div className="text-[10px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded truncate">
                      Monitor
                    </div>
                  </div>
                )}
                {i === 19 && (
                  <div className="mt-1">
                    <div className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded truncate">
                      Threads Post
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
