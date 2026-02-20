'use client';

import { useState } from 'react';
import { openclawApi } from '../lib/openclaw';

const AGENTS = [
  { id: 'jarvis', name: 'Jarvis', role: 'Social Media', emoji: '🎯' },
  { id: 'friday', name: 'Friday', role: 'Developer/CTO', emoji: '💻' },
  { id: 'glass', name: 'Glass', role: 'Researcher', emoji: '🔬' },
  { id: 'epstein', name: 'Epstein', role: 'SEO Specialist', emoji: '🔍' },
  { id: 'yuri', name: 'Yuri', role: 'General', emoji: '🦞' },
];

export default function AgentChat() {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const userMsg = { role: 'user', content: message };
    setChatHistory([...chatHistory, userMsg]);
    setLoading(true);

    try {
      const result = await openclawApi.spawnAgent(selectedAgent.id, message);
      const agentMsg = { 
        role: 'agent', 
        content: result.result?.response || 'Agent responded (check console for details)' 
      };
      setChatHistory([...chatHistory, userMsg, agentMsg]);
    } catch (error) {
      setChatHistory([...chatHistory, userMsg, { role: 'agent', content: 'Error: ' + String(error) }]);
    }

    setMessage('');
    setLoading(false);
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Agent List */}
      <div className="w-48 bg-sidebar rounded-lg p-3">
        <h3 className="text-sm font-semibold text-zinc-400 mb-3">Agents</h3>
        <div className="space-y-2">
          {AGENTS.map(agent => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`w-full text-left p-2 rounded-lg transition-colors ${
                selectedAgent.id === agent.id 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-400 hover:bg-zinc-800/50'
              }`}
            >
              <span className="mr-2">{agent.emoji}</span>
              {agent.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-card rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">
            <span className="mr-2">{selectedAgent.emoji}</span>
            Chat dengan {selectedAgent.name}
          </h2>
          <p className="text-sm text-zinc-500">{selectedAgent.role}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-zinc-800 ml-8' : 'bg-zinc-700 mr-8'}`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          ))}
          {loading && <div className="bg-zinc-700 mr-8 p-3 rounded-lg"><p className="text-sm text-zinc-400">Mengetik...</p></div>}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`Chat dengan ${selectedAgent.name}...`}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
            />
            <button onClick={sendMessage} disabled={loading} className="px-4 py-2 bg-red-600 rounded-lg">Kirim</button>
          </div>
        </div>
      </div>
    </div>
  );
}
