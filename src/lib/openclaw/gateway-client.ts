// OpenClaw Gateway WebSocket Client
// Real-time connection to OpenClaw Gateway for live agent data

type GatewayEventType = 
  | "session.start"
  | "session.end"
  | "session.update"
  | "cron.start"
  | "cron.end"
  | "cron.update"
  | "message"
  | "agent.status"
  | "connected"
  | "disconnected"
  | "error";

export interface GatewaySession {
  id: string;
  agentId: string;
  status: "active" | "idle" | "completed" | "error";
  startTime: string;
  task?: string;
  channel?: string;
  metadata?: Record<string, unknown>;
}

export interface GatewayCronJob {
  id: string;
  name: string;
  schedule: string;
  status: "running" | "idle" | "error" | "disabled";
  lastRun?: string;
  nextRun?: string;
  agentId?: string;
}

export interface GatewayAgent {
  id: string;
  name: string;
  status: "online" | "busy" | "idle" | "offline";
  currentTask?: string;
  lastActive: string;
  avatar: string;
  color: string;
  sessions: GatewaySession[];
}

export interface GatewayMessage {
  id: string;
  agentId: string;
  content: string;
  timestamp: string;
  channel: string;
  type: "incoming" | "outgoing";
}

interface GatewayEvent {
  type: GatewayEventType;
  data: unknown;
  timestamp: string;
}

export type GatewayEventHandler = (event: GatewayEvent) => void;

export class GatewayClient {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string;
  private reconnectInterval: number = 5000;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private eventHandlers: Map<GatewayEventType, Set<GatewayEventHandler>> = new Map();
  private isConnecting: boolean = false;

  constructor(url: string, token: string) {
    this.url = url;
    this.token = token;
  }

  connect(): void {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;

    try {
      // Connect with token in protocols for authentication
      this.ws = new WebSocket(this.url, ["openclaw", this.token]);

      this.ws.onopen = () => {
        console.log("[GatewayClient] Connected to OpenClaw Gateway");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit({
          type: "connected",
          data: { url: this.url },
          timestamp: new Date().toISOString(),
        });

        // Subscribe to events
        this.send({
          action: "subscribe",
          events: ["sessions", "cron", "messages", "agents"],
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error("[GatewayClient] Failed to parse message:", error);
        }
      };

      this.ws.onclose = (event) => {
        console.log("[GatewayClient] Disconnected:", event.code, event.reason);
        this.isConnecting = false;
        this.emit({
          type: "disconnected",
          data: { code: event.code, reason: event.reason },
          timestamp: new Date().toISOString(),
        });
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("[GatewayClient] WebSocket error:", error);
        this.isConnecting = false;
        this.emit({
          type: "error",
          data: { error: "WebSocket connection error" },
          timestamp: new Date().toISOString(),
        });
      };
    } catch (error) {
      console.error("[GatewayClient] Failed to connect:", error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("[GatewayClient] Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectInterval * this.reconnectAttempts, 30000);

    console.log(`[GatewayClient] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private handleMessage(message: unknown): void {
    if (typeof message !== "object" || message === null) return;

    const msg = message as Record<string, unknown>;
    const eventType = msg.type as GatewayEventType;

    if (eventType) {
      this.emit({
        type: eventType,
        data: msg.data || msg,
        timestamp: new Date().toISOString(),
      });
    }
  }

  private emit(event: GatewayEvent): void {
    const handlers = this.eventHandlers.get(event.type);
    if (handlers) {
      handlers.forEach((handler) => handler(event));
    }

    // Also emit to wildcard handlers
    const wildcards = this.eventHandlers.get("*" as GatewayEventType);
    if (wildcards) {
      wildcards.forEach((handler) => handler(event));
    }
  }

  on(event: GatewayEventType, handler: GatewayEventHandler): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(event)?.delete(handler);
    };
  }

  off(event: GatewayEventType, handler: GatewayEventHandler): void {
    this.eventHandlers.get(event)?.delete(handler);
  }

  send(data: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn("[GatewayClient] Cannot send, WebSocket not open");
    }
  }

  // Helper methods for common operations
  getStatus(): "connected" | "connecting" | "disconnected" {
    if (this.ws?.readyState === WebSocket.OPEN) return "connected";
    if (this.isConnecting) return "connecting";
    return "disconnected";
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Request current state from gateway
  requestSessions(): void {
    this.send({ action: "getSessions" });
  }

  requestCronJobs(): void {
    this.send({ action: "getCronJobs" });
  }

  requestAgents(): void {
    this.send({ action: "getAgents" });
  }
}

// Singleton instance for the application
let gatewayClient: GatewayClient | null = null;

export function getGatewayClient(): GatewayClient | null {
  return gatewayClient;
}

export function initGatewayClient(url?: string, token?: string): GatewayClient {
  if (gatewayClient) {
    return gatewayClient;
  }

  const wsUrl = url || process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY_URL || "ws://127.0.0.1:18789";
  const authToken = token || process.env.NEXT_PUBLIC_OPENCLAW_GATEWAY_TOKEN || "";

  gatewayClient = new GatewayClient(wsUrl, authToken);
  return gatewayClient;
}

export function closeGatewayClient(): void {
  if (gatewayClient) {
    gatewayClient.disconnect();
    gatewayClient = null;
  }
}

// React hook helper for using the gateway client
export function useGatewayClient(): GatewayClient | null {
  return gatewayClient;
}

// Default agent configurations for display
export const defaultAgents: GatewayAgent[] = [
  {
    id: "jarvis",
    name: "Jarvis",
    status: "offline",
    lastActive: "Never",
    avatar: "J",
    color: "from-purple-600 to-indigo-600",
    sessions: [],
  },
  {
    id: "friday",
    name: "Friday",
    status: "offline",
    lastActive: "Never",
    avatar: "F",
    color: "from-blue-600 to-cyan-600",
    sessions: [],
  },
  {
    id: "glass",
    name: "Glass",
    status: "offline",
    lastActive: "Never",
    avatar: "G",
    color: "from-emerald-600 to-teal-600",
    sessions: [],
  },
  {
    id: "epstein",
    name: "Epstein",
    status: "offline",
    lastActive: "Never",
    avatar: "E",
    color: "from-orange-600 to-amber-600",
    sessions: [],
  },
  {
    id: "yuri",
    name: "Yuri",
    status: "offline",
    lastActive: "Never",
    avatar: "Y",
    color: "from-rose-600 to-pink-600",
    sessions: [],
  },
];
