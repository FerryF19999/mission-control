"use client";

import { useEffect, useState } from "react";
import { 
  Bot, 
  Activity, 
  Clock, 
  Cpu,
  MoreHorizontal,
  Wifi,
  WifiOff
} from "lucide-react";
import {
  initGatewayClient,
  closeGatewayClient,
  defaultAgents,
  GatewayAgent,
} from "@/lib/openclaw/gateway-client";

interface AgentStatusProps {
  compact?: boolean;
}

export default function AgentStatus({ compact = false }: AgentStatusProps) {
  const [agents, setAgents] = useState<GatewayAgent[]>(defaultAgents);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected">("disconnected");

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY_URL || "ws://127.0.0.1:18789";
    const token = process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY_TOKEN || "";

    const gateway = initGatewayClient(wsUrl, token);

    // Set up event handlers
    const unsubConnected = gateway.on("connected", () => {
      setConnectionStatus("connected");
      gateway.requestAgents();
    });

    const unsubDisconnected = gateway.on("disconnected", () => {
      setConnectionStatus("disconnected");
    });

    const unsubAgentStatus = gateway.on("agent.status", (event) => {
      const agentUpdate = event.data as GatewayAgent;
      setAgents((prev) =>
        prev.map((a) => (a.id === agentUpdate.id ? { ...a, ...agentUpdate } : a))
      );
    });

    // Also simulate some updates when not connected to real gateway
    const simulationInterval = setInterval(() => {
      if (connectionStatus === "disconnected") {
        setAgents((prev) =>
          prev.map((agent) => ({
            ...agent,
            status: Math.random() > 0.7
              ? (["online", "busy", "idle", "offline"] as const)[Math.floor(Math.random() * 4)]
              : agent.status,
            lastActive: agent.status === "busy" ? "Active now" : agent.lastActive,
          }))
        );
      }
    }, 10000);

    return () => {
      unsubConnected();
      unsubDisconnected();
      unsubAgentStatus();
      clearInterval(simulationInterval);
    };
  }, [connectionStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-emerald-500";
      case "busy":
        return "bg-amber-500";
      case "idle":
        return "bg-slate-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="w-3 h-3" />;
      case "offline":
        return <WifiOff className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
    }
  };

  if (compact) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-slate-100">Agent Status</h2>
          </div>
          <div className="flex items-center gap-2">
            {connectionStatus === "connected" ? (
              <Wifi className="w-4 h-4 text-emerald-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-slate-500" />
            )}
            <span className="text-xs text-slate-500">
              {agents.filter((a) => a.status !== "offline").length}/{agents.length} Active
            </span>
          </div>
        </div>
        <div className="space-y-3">
          {agents.slice(0, 4).map((agent) => (
            <div
              key={agent.id}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-white font-semibold text-sm`}
                >
                  {agent.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{agent.name}</p>
                  {agent.currentTask && (
                    <p className="text-xs text-slate-500 truncate max-w-[150px]">
                      {agent.currentTask}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} ${
                    agent.status === "online" ? "animate-pulse" : ""
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
              >
                {agent.avatar}
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  agent.status === "online"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : agent.status === "busy"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : agent.status === "idle"
                    ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {getStatusIcon(agent.status)}
                <span className="capitalize">{agent.status}</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-1">{agent.name}</h3>
            {agent.currentTask ? (
              <p className="text-sm text-blue-400 mb-2">{agent.currentTask}</p>
            ) : (
              <p className="text-sm text-slate-500 mb-2">No active task</p>
            )}
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              <span>{agent.lastActive}</span>
            </div>
          </div>
        ))}
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{agents.filter(a => a.status === "online").length}</p>
              <p className="text-sm text-slate-500">Online Agents</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{agents.filter(a => a.status === "busy").length}</p>
              <p className="text-sm text-slate-500">Working</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <MoreHorizontal className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{agents.filter(a => a.status === "idle" || a.status === "offline").length}</p>
              <p className="text-sm text-slate-500">Idle/Offline</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
