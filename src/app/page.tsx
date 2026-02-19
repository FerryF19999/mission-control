"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Calendar, 
  Brain, 
  Bot, 
  MessageSquare, 
  Menu,
  X,
  Zap,
  Radio
} from "lucide-react";
import AgentStatus from "@/components/AgentStatus";
import TasksBoard from "@/components/TasksBoard";
import CalendarView from "@/components/CalendarView";
import MemoryView from "@/components/MemoryView";
import ChatCommand from "@/components/ChatCommand";
import RealtimeStatus from "@/components/RealtimeStatus";

type Tab = "dashboard" | "tasks" | "calendar" | "memory" | "chat" | "realtime";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
    { id: "realtime" as Tab, label: "Realtime", icon: Radio },
    { id: "tasks" as Tab, label: "Tasks Board", icon: Zap },
    { id: "calendar" as Tab, label: "Calendar", icon: Calendar },
    { id: "memory" as Tab, label: "Memory", icon: Brain },
    { id: "chat" as Tab, label: "Command", icon: MessageSquare },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealtimeStatus compact />
              <AgentStatus compact />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TasksBoard compact />
              <CalendarView compact />
            </div>
          </div>
        );
      case "tasks":
        return <TasksBoard />;
      case "calendar":
        return <CalendarView />;
      case "memory":
        return <MemoryView />;
      case "chat":
        return <ChatCommand />;
      case "realtime":
        return <RealtimeStatus />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                OpenClaw
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <tab.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{tab.label}</span>}
            </button>
          ))}
        </nav>

        {/* Toggle Button */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-100">
              {tabs.find((t) => t.id === activeTab)?.label || "Dashboard"}
            </h1>
            <p className="text-xs text-slate-500">
              Mission Control Center
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-mono text-slate-300">
                {currentTime.toLocaleTimeString()}
              </p>
              <p className="text-xs text-slate-500">
                {currentTime.toLocaleDateString(undefined, {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">FF</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
