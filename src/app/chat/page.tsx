'use client';

import { useState } from 'react';

const AGENTS = [
  { id: 'jarvis', name: 'Jarvis', role: 'Social Media', emoji: '🎯' },
  { id: 'friday', name: 'Friday', role: 'Developer/CTO', emoji: '💻' },
  { id: 'glass', name: 'Glass', role: 'Researcher', emoji: '🔬' },
  { id: 'epstein', name: 'Epstein', role: 'SEO', emoji: '🔍' },
  { id: 'yuri', name: 'Yuri', role: 'General', emoji: '🦞' },
];

const OPENCLAW_URL = 'https://oc-196993-lsur.xc1.app';
const OPENCLAW_TOKEN = '95e6bf5a720765e27e0637b930f2ea6d1854ae85f3efcbd661a7306ce22f2c30';

export default function Chat() {
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

    try {
      const response = await fetch(OPENCLAW_URL + '/sessions_spawn', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + OPENCLAW_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          task: message
        }),
      });
      
      const data = await response.json();
      const agentMsg = { 
        role: 'agent', 
        content: data.result?.response || 'Agent responded (check console)' 
      };
      setChatHistory([...chatHistory, userMsg, agentMsg]);
    } catch (error) {
      setChatHistory([...chatHistory, userMsg, { role: 'agent', content: 'Error: ' + String(error) }]);
    }

    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: 'white' }}>
      <aside style={{ width: '16rem', background: '#111', borderRight: '1px solid #2a2a2a', padding: '1rem', position: 'fixed', height: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderBottom: '1px solid #2a2a2a', marginBottom: '1rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>🚀</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>Mission Control</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>OpenClaw Hub</div>
          </div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: '#9ca3af', textDecoration: 'none' }}>🏠 Dashboard</a>
          <a href="/chat" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: 'white', background: '#1f2937', textDecoration: 'none' }}>🤖 Chat</a>
          <a href="/tasks" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: '#9ca3af', textDecoration: 'none' }}>📋 Tasks</a>
          <a href="/memory" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: '#9ca3af', textDecoration: 'none' }}>🧠 Memory</a>
          <a href="/team" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: '#9ca3af', textDecoration: 'none' }}>👥 Team</a>
        </nav>
      </aside>
      
      <main style={{ marginLeft: '16rem', flex: 1, padding: '1rem', display: 'flex', gap: '1rem' }}>
        <div style={{ width: '12rem', background: '#111', borderRadius: '0.5rem', padding: '0.75rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af', marginBottom: '0.75rem' }}>Agents</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {AGENTS.map(agent => (
              <button
                key={agent.id}
                onClick={() => { setSelectedAgent(agent); setChatHistory([]); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  background: selectedAgent.id === agent.id ? '#1f2937' : 'transparent',
                  color: selectedAgent.id === agent.id ? 'white' : '#9ca3af',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>{agent.emoji}</span>
                {agent.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1a1a1a', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #2a2a2a' }}>
            <h2 style={{ fontWeight: 600 }}>
              <span style={{ marginRight: '0.5rem' }}>{selectedAgent.emoji}</span>
              Chat dengan {selectedAgent.name}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{selectedAgent.role}</p>
          </div>

          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
            {chatHistory.length === 0 && (
              <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '2.5rem' }}>
                <p>Pilih agent dan mulai chat!</p>
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
                  background: msg.role === 'user' ? '#1f2937' : '#374151'
                }}
              >
                <p style={{ fontSize: '0.875rem' }}>{msg.content}</p>
              </div>
            ))}
            {loading && (
              <div style={{ background: '#374151', padding: '0.75rem', borderRadius: '0.5rem', marginRight: '2rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Mengetik...</p>
              </div>
            )}
          </div>

          <div style={{ padding: '1rem', borderTop: '1px solid #2a2a2a', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`Chat dengan ${selectedAgent.name}...`}
              style={{ 
                flex: 1, 
                background: '#1f2937', 
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
                background: '#dc2626', 
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
      </main>
    </div>
  );
}
