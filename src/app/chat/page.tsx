'use client';

import { useState } from 'react';

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

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const userMsg = { role: 'user', content: message };
    setChatHistory([...chatHistory, userMsg]);
    setLoading(true);
    setMessage('');

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
    <div style={{ display: 'flex', gap: '1rem', height: '100%' }}>
      {/* Agent List */}
      <div style={{ width: '12rem', backgroundColor: '#111', borderRadius: '0.5rem', padding: '0.75rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.75rem' }}>Agents</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {AGENTS.map(agent => (
            <button
              key={agent.id}
              onClick={() => { setSelectedAgent(agent); setChatHistory([]); }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                backgroundColor: selectedAgent.id === agent.id ? '#1f2937' : 'transparent',
                color: selectedAgent.id === agent.id ? 'white' : '#9ca3af',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>{agent.emoji}</span>
              {agent.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a1a', borderRadius: '0.5rem', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '1rem', borderBottom: '1px solid #2a2a2a' }}>
          <h2 style={{ fontWeight: 600 }}>
            <span style={{ marginRight: '0.5rem' }}>{selectedAgent.emoji}</span>
            Chat dengan {selectedAgent.name}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{selectedAgent.role}</p>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
          {chatHistory.length === 0 && (
            <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '2.5rem' }}>
              <p>Klik agent dan mulai chat!</p>
            </div>
          )}
          {chatHistory.map((msg, i) => (
            <div 
              key={i} 
              style={{ 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                marginBottom: '0.5rem',
                marginLeft: msg.role === 'user' ? '2rem' : 0,
                marginRight: msg.role === 'agent' ? '2rem' : 0,
                backgroundColor: msg.role === 'user' ? '#1f2937' : '#374151'
              }}
            >
              <p style={{ fontSize: '0.875rem' }}>{msg.content}</p>
            </div>
          ))}
          {loading && (
            <div style={{ backgroundColor: '#374151', padding: '0.75rem', borderRadius: '0.5rem', marginRight: '2rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Mengetik...</p>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: '1rem', borderTop: '1px solid #2a2a2a', display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={`Chat dengan ${selectedAgent.name}...`}
            style={{ 
              flex: 1, 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151', 
              borderRadius: '0.5rem', 
              padding: '0.5rem 1rem', 
              color: 'white'
            }}
          />
          <button 
            onClick={sendMessage} 
            disabled={loading}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#dc2626', 
              borderRadius: '0.5rem', 
              color: 'white', 
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}
