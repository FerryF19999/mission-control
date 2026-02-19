"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Activity,
  Clock,
  Wifi,
  WifiOff,
  RefreshCw,
  Server,
  Calendar,
  Bot,
  AlertCircle,
  CheckCircle2,
  Timer,
  MessageSquare,
} from "lucide-react";
import {
  GatewayClient,
  initGatewayClient,
  closeGatewayClient,
  defaultAgents,
  GatewayAgent,
  GatewaySession,
  GatewayCronJob,
  GatewayMessage,
} from "@/lib/openclaw/gateway-client";

interface RealtimeStatusProps {
  compact?: boolean;
}

export default function RealtimeStatus({ compact = false }: RealtimeStatusProps) {
  const [client, setClient] = useState<GatewayClient | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("disconnected");
  const [agents, setAgents] = useState<GatewayAgent[]>(defaultAgents);
  const [sessions, setSessions] = useState<GatewaySession[]>([]);
  const [cronJobs, setCronJobs] = useState<GatewayCronJob[]>([]);
  const [recentMessages, setRecentMessages] = useState<GatewayMessage[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Initialize WebSocket connection
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY_URL || "ws://127.0.0.1:18789";
    const token = process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY_TOKEN || "";

    const gateway = initGatewayClient(wsUrl, token);
    setClient(gateway);

    // Set up event handlers
    const unsubConnected = gateway.on("connected", () => {
      setConnectionStatus("connected");
      gateway.requestSessions();
      gateway.requestCronJobs();
      gateway.requestAgents();
    });

    const unsubDisconnected = gateway.on("disconnected", () => {
      setConnectionStatus("disconnected");
    });

    const unsubSessionStart = gateway.on("session.start", (event) => {
      const session = event.data as GatewaySession;
      setSessions((prev) => [...prev.filter((s) => s.id !== session.id), session]);
      updateAgentFromSession(session);
      setLastUpdate(new Date());
    });

    const unsubSessionEnd = gateway.on("session.end", (event) => {
      const session = event.data as GatewaySession;
      setSessions((prev) => prev.filter((s) => s.id !== session.id));
      setLastUpdate(new Date());
    });

    const unsubSessionUpdate = gateway.on("session.update", (event) => {
      const session = event.data as GatewaySession;
      setSessions((prev) =>
        prev.map((s) => (s.id === session.id ? session : s))
      );
      updateAgentFromSession(session);
      setLastUpdate(new Date());
    });

    const unsubCronUpdate = gateway.on("cron.update", (event) => {
      const cronJob = event.data as GatewayCronJob;
      setCronJobs((prev) =>
        [...prev.filter((c) => c.id !== cronJob.id), cronJob].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
      setLastUpdate(new Date());
    });

    const unsubAgentStatus = gateway.on("agent.status", (event) => {
      const agent = event.data as GatewayAgent;
      setAgents((prev) =>
        prev.map((a) => (a.id === agent.id ? { ...a, ...agent } : a))
      );
      setLastUpdate(new Date());
    });

    const unsubMessage = gateway.on("message", (event) => {
      const message = event.data as GatewayMessage;
      setRecentMessages((prev) => [message, ...prev].slice(0, 10));
      setLastUpdate(new Date());
    });

    // Connect
    gateway.connect();
    setConnectionStatus("connecting");

    // Cleanup
    return () => {
      unsubConnected();
      unsubDisconnected();
      unsubSessionStart();
      unsubSessionEnd();
      unsubSessionUpdate();
      unsubCronUpdate();
      unsubAgentStatus();
      unsubMessage();
      closeGatewayClient();
    };
  }, []);

  const updateAgentFromSession = useCallback((session: GatewaySession) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === session.agentId) {
          return {
            ...agent,
            status: session.status === "active" ? "busy" : "online",
            currentTask: session.task,
            lastActive: "Active now",
            sessions: [...agent.sessions.filter((s) => s.id !== session.id), session],
          };
        }
        return agent;
      })
    );
  }, []);

  const handleReconnect = () => {
    if (client) {
      client.disconnect();
      setConnectionStatus("connecting");
      setTimeout(() => client.connect(), 500);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
      case "connected":
      case "active":
        return "bg-emerald-500";
      case "busy":
      case "running":
        return "bg-amber-500";
      case "idle":
        return "bg-slate-500";
      case "offline":
      case "disconnected":
      case "error":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "online":
        return <Wifi className="w-4 h-4 text-emerald-400" />;
      case "connecting":
        return <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />;
      default:
        return <WifiOff className="w-4 h-4 text-red-400" />;
    }
  };

  if (compact) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        {/* Connection Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-slate-100">Live Status</h2>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(connectionStatus)}
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : connectionStatus === "connecting"
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {connectionStatus}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400">Sessions</span>
            </div>
            <p className="text-xl font-bold text-slate-100">{sessions.length}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-slate-400">Cron Jobs</span>
            </div>
            <p className="text-xl font-bold text-slate-100">{cronJobs.length}</p>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="space-y-2 mb-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Sessions
          </h3>
          {sessions.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No active sessions</p>
          ) : (
            sessions.slice(0, 3).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-200 capitalize">
                      {session.agentId}
                    </p>
                    {session.task && (
                      <p className="text-xs text-slate-500 truncate max-w-[120px]">
                        {session.task}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${getStatusColor(
                    session.status
                  )} animate-pulse`}
                />
              </div>
            ))
          )}
        </div>

        {/* Cron Jobs Status */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Cron Jobs
          </h3>
          {cronJobs.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No cron jobs configured</p>
          ) : (
            cronJobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50"
              >
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">{job.name}</p>
                    <p className="text-xs text-slate-500">{job.schedule}</p>
                  </div>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${getStatusColor(job.status)}`}
                />
              </div>
            ))
          )}
        </div>

        {/* Last Update */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-right">
            Updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  }

  // Full view
  return (
    <div className="space-y-6">
      {/* Connection Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              connectionStatus === "connected"
                ? "bg-emerald-500/10"
                : connectionStatus === "connecting"
                ? "bg-amber-500/10"
                : "bg-red-500/10"
            }`}
          >
            {getStatusIcon(connectionStatus)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              Gateway Connection
            </h2>
            <p className="text-sm text-slate-500">
              {connectionStatus === "connected"
                ? "Real-time updates active"
                : connectionStatus === "connecting"
                ? "Establishing connection..."
                : "Disconnected from gateway"}
            </p>
          </div>
        </div>
        <button
          onClick={handleReconnect}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Reconnect
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{sessions.length}</p>
              <p className="text-sm text-slate-500">Active Sessions</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">{cronJobs.length}</p>
              <p className="text-sm text-slate-500">Cron Jobs</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">
                {agents.filter((a) => a.status !== "offline").length}
              </p>
              <p className="text-sm text-slate-500">Online Agents</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-100">
                {recentMessages.length}
              </p>
              <p className="text-sm text-slate-500">Recent Messages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions Detail */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Active Sessions</h3>
          <span className="text-xs text-slate-500">
            {sessions.filter((s) => s.status === "active").length} running
          </span>
        </div>
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <Server className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No active sessions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-200 capitalize">
                      {session.agentId}
                    </p>
                    <p className="text-sm text-slate-500">
                      {session.task || "No task assigned"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-400">{session.channel}</p>
                    <p className="text-xs text-slate-500">
                      Started: {new Date(session.startTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      session.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : session.status === "error"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cron Jobs Detail */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Cron Jobs</h3>
          <span className="text-xs text-slate-500">
            {cronJobs.filter((c) => c.status === "running").length} running
          </span>
        </div>
        {cronJobs.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">No cron jobs configured</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cronJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Timer className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{job.name}</p>
                    <p className="text-sm text-slate-500">{job.schedule}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {job.lastRun && (
                      <p className="text-xs text-slate-500">
                        Last: {new Date(job.lastRun).toLocaleString()}
                      </p>
                    )}
                    {job.nextRun && (
                      <p className="text-xs text-slate-500">
                        Next: {new Date(job.nextRun).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.status === "running"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : job.status === "error"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : job.status === "disabled"
                        ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Messages */}
      {recentMessages.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-100">Recent Messages</h3>
            <span className="text-xs text-slate-500">
              Last {recentMessages.length} messages
            </span>
          </div>
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-slate-200 capitalize">
                      {msg.agentId}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        msg.type === "incoming"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {msg.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Update */}
      <div className="text-right">
        <p className="text-xs text-slate-500">
          Last update: {lastUpdate.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
