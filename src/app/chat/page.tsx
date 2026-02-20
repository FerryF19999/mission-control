'use client';

import { useState } from 'react';

const AGENTS = [
  { id: 'jarvis', name: 'Jarvis', role: 'Social Media', emoji: '🎯', greeting: 'Hey! Jarvis here. Social media specialist. Apa yang kamu butuhin?' },
  { id: 'friday', name: 'Friday', role: 'Developer/CTO', emoji: '💻', greeting: 'Hi! Friday here. Ready to help dengan coding atau tech stuff.' },
  { id: 'glass', name: 'Glass', role: 'Researcher', emoji: '🔬', greeting: 'Glass here. Need research? Aku bisa bantu!' },
  { id: 'epstein', name: 'Epstein', role: 'SEO', emoji: '🔍', greeting: 'Epstein here. SEO expert. Lets ranking naik!' },
  { id: 'yuri', name: 'Yuri', role: 'General', emoji: '🦞', greeting: 'Yuri here! Ada yang bisa aku bantu?' },
];

export default function Chat() {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const userMsg = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMsg]);
    setLoading(true);
    setMessage('');

    // Demo response
    setTimeout(() => {
      const agentMsg = { role: 'agent', content: selectedAgent.greeting };
      setChatHistory(prev => [...prev, agentMsg]);
      setLoading(false);
    }, 1500);
  };

  const selectAgent = (agent: typeof AGENTS[0]) => {
    setSelectedAgent(agent);
    setChatHistory([]);
  };

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#0a0a0a',color:'white'}}>
      <aside style={{width:'200px',background:'#111',padding:'1rem',borderRight:'1px solid #333'}}>
        <h3 style={{fontSize:'14px',color:'#888',marginBottom:'12px'}}>AGENTS</h3>
        {AGENTS.map(agent => (
          <button
            key={agent.id}
            onClick={() => selectAgent(agent)}
            style={{
              width:'100%',display:'flex',alignItems:'center',gap:'8px',padding:'10px',
              borderRadius:'8px',border:'none',cursor:'pointer',marginBottom:'4px',
              background: selectedAgent.id === agent.id ? '#222' : 'transparent',
              color: selectedAgent.id === agent.id ? 'white' : '#888'
            }}
          >
            <span>{agent.emoji}</span>
            <span style={{fontSize:'14px'}}>{agent.name}</span>
          </button>
        ))}
      </aside>
      
      <main style={{flex:1,display:'flex',flexDirection:'column'}}>
        <div style={{padding:'1rem',borderBottom:'1px solid #333'}}>
          <h2 style={{fontSize:'18px',fontWeight:600}}>{selectedAgent.emoji} Chat dengan {selectedAgent.name}</h2>
          <p style={{fontSize:'14px',color:'#666'}}>{selectedAgent.role}</p>
        </div>
        
        <div style={{flex:1,padding:'1rem',overflowY:'auto'}}>
          {chatHistory.length === 0 && (
            <p style={{color:'#666',textAlign:'center',marginTop:'2rem'}}>Pilih agent dan mulai chat!</p>
          )}
          {chatHistory.map((msg, i) => (
            <div key={i} style={{
              padding:'12px',borderRadius:'8px',marginBottom:'8px',
              maxWidth:'70%',marginLeft: msg.role === 'user' ? 'auto' : 0,
              background: msg.role === 'user' ? '#222' : '#333'
            }}>
              <p style={{fontSize:'14px'}}>{msg.content}</p>
            </div>
          ))}
          {loading && (
            <div style={{padding:'12px',borderRadius:'8px',background:'#333',maxWidth:'70%'}}>
              <p style={{fontSize:'14px',color:'#888'}}>Mengetik...</p>
            </div>
          )}
        </div>
        
        <div style={{padding:'1rem',borderTop:'1px solid #333',display:'flex',gap:'8px'}}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={`Chat dengan ${selectedAgent.name}...`}
            style={{
              flex:1,padding:'12px',borderRadius:'8px',border:'1px solid #333',
              background:'#111',color:'white',fontSize:'14px'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding:'12px 24px',borderRadius:'8px',border:'none',
              background:'#dc2626',color:'white',cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            Kirim
          </button>
        </div>
      </main>
    </div>
  );
}
