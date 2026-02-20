"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Command,
  ChevronDown,
  Sparkles,
  Terminal,
  MoreHorizontal,
  Paperclip,
  Mic,
  Image
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  agent?: string;
  timestamp: string;
  status?: "sending" | "sent" | "error";
}

const agents = [
  { id: "jarvis", name: "Jarvis", color: "bg-purple-600", desc: "Content & Strategy" },
  { id: "friday", name: "Friday", color: "bg-blue-600", desc: "Development" },
  { id: "glass", name: "Glass", color: "bg-emerald-600", desc: "Memory & Archives" },
  { id: "epstein", name: "Epstein", color: "bg-orange-600", desc: "Testing & QA" },
  { id: "yuri", name: "Yuri", color: "bg-rose-600", desc: "Monitoring" },
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "agent",
    content: "Welcome to Mission Control, Ferry. I'm Friday, currently building your dashboard. How can I assist you today?",
    agent: "Friday",
    timestamp: "16:20",
    status: "sent",
  },
];

export default function ChatCommand() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(agents[1]); // Friday default
  const [showAgentSelect, setShowAgentSelect] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const responses: Record<string, string> = {
        jarvis: "I'll optimize the content calendar and prepare the next batch of posts for Threads. Should be ready in about 10 minutes.",
        friday: "Roger that. I'm on it - will update the Mission Control dashboard with the new features you requested.",
        glass: "I'll archive the old memory files and optimize the storage. Cleaning up conversations older than 30 days.",
        epstein: "Starting API integration tests now. I'll run the full test suite and report back with results.",
        yuri: "Monitoring all agents now. Current status: Jarvis (online), Friday (busy), Glass (idle), Epstein (offline).",
      };

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: responses[selectedAgent.id] || "Task acknowledged. Working on it now.",
        agent: selectedAgent.name,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
      };

      setMessages((prev) => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickCommands = [
    { label: "Status Check", command: "@yuri check all agent status" },
    { label: "New Content", command: "@jarvis create content for tomorrow" },
    { label: "Clean Memory", command: "@glass archive old memories" },
    { label: "Run Tests", command: "@epstein run full test suite" },
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowAgentSelect(!showAgentSelect)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <div className={`w-8 h-8 ${selectedAgent.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                {selectedAgent.name[0]}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-200">{selectedAgent.name}</p>
                <p className="text-xs text-slate-500">{selectedAgent.desc}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
            
            {showAgentSelect && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgent(agent);
                      setShowAgentSelect(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                  >
                    <div className={`w-8 h-8 ${agent.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                      {agent.name[0]}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-200">{agent.name}</p>
                      <p className="text-xs text-slate-500">{agent.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors">
            <Terminal className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                message.role === "user"
                  ? "bg-gradient-to-br from-blue-600 to-cyan-600"
                  : message.agent
                  ? agents.find((a) => a.name === message.agent)?.color || "bg-slate-600"
                  : "bg-slate-600"
              }`}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div className={`max-w-[70%] ${message.role === "user" ? "text-right" : ""}`}>
              <div
                className={`inline-block px-4 py-2 rounded-2xl text-sm ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-slate-800 text-slate-200 rounded-bl-md border border-slate-700"
                }`}
              >
                {message.content}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {message.agent && `${message.agent} • `}
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className={`w-8 h-8 ${selectedAgent.color} rounded-lg flex items-center justify-center`}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Commands */}
      <div className="px-4 py-2 border-t border-slate-800/50">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => setInput(cmd.command)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3" />
              {cmd.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-2 bg-slate-800 rounded-xl px-4 py-2 border border-slate-700 focus-within:border-blue-500 transition-colors">
          <button className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${selectedAgent.name}...`}
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none text-sm"
          />
          <button className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors">
            <Image className="w-5 h-5" />
          </button>
          <button className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-xs text-slate-600 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
