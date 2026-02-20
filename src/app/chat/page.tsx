'use client';

import { useState, useRef, useEffect } from 'react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    
    const userMsg = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMsg]);
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${OPENCLAW_URL}/v1/sessions/spawn`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENCLAW_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: selectedAgent.id,
          task: message,
          channel: 'web'
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const agentMsg = { 
        role: 'agent', 
        content: data.response || data.result?.response || data.message || `Task assigned to ${selectedAgent.name}. Check your OpenClaw dashboard for progress.`
      };
      setChatHistory(prev => [...prev, agentMsg]);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      setChatHistory(prev => [...prev, { role: 'agent', content: `❌ Error: ${errorMsg}` }]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectAgent = (agent: typeof AGENTS[0]) => {
    setSelectedAgent(agent);
    setChatHistory([]);
    setMessage('');
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '16px',
      height: 'calc(100vh - 100px)',
      minHeight: '500px'
    }}>
      {/* Agent List */}
      <div style={{ 
        width: '220px', 
        background: '#111', 
        borderRadius: '12px', 
        padding: '16px', 
        height: '100%',
        border: '1px solid #2a2a2a',
        overflowY: 'auto',
        flexShrink: 0
      }}>
        <h3 style={{ 
          fontSize: '12px', 
          fontWeight: 600, 
          color: '#6b7280', 
          margin: '0 0 16px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>Select Agent</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {AGENTS.map(agent => (
            <button
              key={agent.id}
              onClick={() => selectAgent(agent)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                borderRadius: '8px',
                background: selectedAgent.id === agent.id ? '#dc2626' : 'transparent',
                color: selectedAgent.id === agent.id ? 'white' : '#9ca3af',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: selectedAgent.id === agent.id ? 500 : 400,
                transition: 'all 0.2s',
                borderLeft: selectedAgent.id === agent.id ? '3px solid white' : '3px solid transparent'
              }}
            >
              <span style={{ fontSize: '20px' }}>{agent.emoji}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{agent.name}</div>
                <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>{agent.role}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        background: '#1a1a1a', 
        borderRadius: '12px', 
        overflow: 'hidden',
        border: '1px solid #2a2a2a'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '16px 20px', 
          borderBottom: '1px solid #2a2a2a',
          background: '#111',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '32px' }}>{selectedAgent.emoji}</span>
          <div style={{ flex: 1 }}>
            <h2 style={{ 
              fontWeight: 600, 
              margin: 0,
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {selectedAgent.name}
              <span style={{ 
                fontSize: '10px', 
                background: selectedAgent.id === 'yuri' ? '#ea580c' : '#6b7280', 
                padding: '2px 8px', 
                borderRadius: '10px',
                fontWeight: 500
              }}>
                {selectedAgent.role}
              </span>
            </h2>
            <p style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              margin: '4px 0 0 0' 
            }}>
              Connected to OpenClaw API
            </p>
          </div>
          <div style={{
            width: '8px',
            height: '8px',
            background: '#22c55e',
            borderRadius: '50%',
            boxShadow: '0 0 8px #22c55e'
          }} />
        </div>

        {/* Messages */}
        <div style={{ 
          flex: 1, 
          padding: '20px', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: '#0a0a0a'
        }}>
          {chatHistory.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              color: '#6b7280', 
              marginTop: '80px',
              padding: '0 40px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#9ca3af' }}>
                Start a conversation with {selectedAgent.name}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
                Send a message to assign tasks, ask questions, or get help. 
                The agent will respond through the OpenClaw API.
              </p>
            </div>
          )}
          
          {chatHistory.map((msg, i) => (
            <div 
              key={i} 
              style={{ 
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              {msg.role === 'agent' && (
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: '#2a2a2a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '8px',
                  fontSize: '16px',
                  flexShrink: 0
                }}>
                  {selectedAgent.emoji}
                </div>
              )}
              <div style={{ 
                maxWidth: '70%',
                padding: '12px 16px', 
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', 
                background: msg.role === 'user' ? '#dc2626' : '#1f2937',
                color: 'white',
                fontSize: '14px',
                lineHeight: 1.5,
                wordBreak: 'break-word'
              }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={{ 
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-end'
            }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: '#2a2a2a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '8px',
                fontSize: '16px'
              }}>
                {selectedAgent.emoji}
              </div>
              <div style={{ 
                padding: '16px 20px', 
                borderRadius: '16px 16px 16px 4px', 
                background: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  background: '#9ca3af',
                  borderRadius: '50%',
                  animation: 'typing 1.4s infinite ease-in-out both'
                }}></span>
                <span style={{
                  width: '6px',
                  height: '6px',
                  background: '#9ca3af',
                  borderRadius: '50%',
                  animation: 'typing 1.4s infinite ease-in-out both 0.2s'
                }}></span>
                <span style={{
                  width: '6px',
                  height: '6px',
                  background: '#9ca3af',
                  borderRadius: '50%',
                  animation: 'typing 1.4s infinite ease-in-out both 0.4s'
                }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ 
          padding: '16px 20px', 
          borderTop: '1px solid #2a2a2a',
          background: '#111',
          display: 'flex', 
          gap: '12px' 
        }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Message ${selectedAgent.name}...`}
            disabled={loading}
            style={{ 
              flex: 1, 
              background: '#1a1a1a', 
              border: '1px solid #374151', 
              borderRadius: '24px', 
              padding: '12px 20px', 
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
          />
          <button 
            onClick={sendMessage} 
            disabled={loading || !message.trim()}
            style={{ 
              padding: '12px 24px', 
              background: loading || !message.trim() ? '#374151' : '#dc2626', 
              borderRadius: '24px', 
              color: 'white', 
              border: 'none',
              cursor: loading || !message.trim() ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Send</span>
            <span style={{ fontSize: '16px' }}>→</span>
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
