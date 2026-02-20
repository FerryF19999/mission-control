'use client';

import { useState } from 'react';
import { openclawApi } from '../../lib/openclaw';

const AGENTS = [
  { id: 'jarvis', name: 'Jarvis', role: 'Social Media', emoji: '🎯', demo: 'Hey! Jarvis here. Social media specialist. What do you need?' },
  { id: 'friday', name: 'Friday', role: 'Developer/CTO', emoji: '💻', demo: 'Hi! Friday here. Ready to help with coding or tech stuff.' },
  { id: 'glass', name: 'Glass', role: 'Researcher', emoji: '🔬', demo: 'Glass here. Need research? I got you.' },
  { id: 'epstein', name: 'Epstein', role: 'SEO', emoji: '🔍', demo: 'Epstein here. SEO expert. Lets rank!' },
  { id: 'yuri', name: 'Yuri', role: 'General', emoji: '🦞', demo: 'Yuri here! Whats up?' },
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
    setMessage('');

    // Demo response (since API not connected yet)
    setTimeout(() => {
      const agentMsg = { 
        role: 'agent', 
        content: selectedAgent.demo || `${selectedAgent.name} is thinking...`
      };
      setChatHistory(prev => [...prev, agentMsg]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Agent List */}
      <div className="w-48 bg-[#111] rounded-lg p-3">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Agents</h3>
        <div className="space-y-2">
          {AGENTS.map(agent => (
            <button
              key={agent.id}
              onClick={() => { setSelectedAgent(agent); setChatHistory([]); }}
              className={`w-full text-left p-2 rounded-lg transition-colors ${
                selectedAgent.id === agent.id 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:bg-gray-800/50'
              }`}
            >
              <span className="mr-2">{agent.emoji}</span>
              {agent.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#1a1a1a] rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#2a2a2a]">
          <h2 className="font-semibold">
            <span className="mr-2">{selectedAgent.emoji}</span>
            Chat dengan {selectedAgent.name}
          </h2>
          <p className="text-sm text-gray-500">{selectedAgent.role}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {chatHistory.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              <p>Klik agent dan mulai chat!</p>
            </div>
          )}
          {chatHistory.map((msg, i) => (
            <div key={i} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-gray-800 ml-8' : 'bg-gray-700 mr-8'}`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          ))}
          {loading && <div className="bg-gray-700 mr-8 p-3 rounded-lg"><p className="text-sm text-gray-400">Mengetik...</p></div>}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#2a2a2a]">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`Chat dengan ${selectedAgent.name}...`}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
            />
            <button onClick={sendMessage} disabled={loading} className="px-4 py-2 bg-red-600 rounded-lg">Kirim</button>
          </div>
        </div>
      </div>
    </div>
  );
}
