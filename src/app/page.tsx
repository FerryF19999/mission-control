'use client';

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  const events = useQuery(api.events.list);

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
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: 'white', background: '#1f2937', textDecoration: 'none' }}>🏠 Dashboard</a>
          <a href="/chat" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: '#9ca3af', textDecoration: 'none' }}>🤖 Chat</a>
          <a href="/tasks" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: '#9ca3af', textDecoration: 'none' }}>📋 Tasks</a>
          <a href="/memory" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: '#9ca3af', textDecoration: 'none' }}>🧠 Memory</a>
          <a href="/team" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: '#9ca3af', textDecoration: 'none' }}>👥 Team</a>
          <a href="/content" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: '#9ca3af', textDecoration: 'none' }}>📝 Content</a>
          <a href="/calendar" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', color: '#9ca3af', textDecoration: 'none' }}>📅 Calendar</a>
        </nav>
      </aside>
      <main style={{ marginLeft: '16rem', flex: 1, padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Welcome to Mission Control 🚀</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#111', borderRadius: '9999px', fontSize: '0.875rem' }}>
            <div style={{ width: '0.5rem', height: '0.5rem', background: '#22c55e', borderRadius: '50%' }}></div>
            <span>4/5 Agents Active</span>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontSize: '1.5rem', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>🤖</div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700 }}>5</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Active Agents</div>
          </div>
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontSize: '1.5rem', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>📋</div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700 }}>12</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Tasks Today</div>
          </div>
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontSize: '1.5rem', background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>🧠</div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700 }}>48</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Memories</div>
          </div>
          <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '0.75rem', padding: '1.25rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontSize: '1.5rem', background: 'linear-gradient(135deg, #22c55e, #10b981)' }}>📅</div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700 }}>8</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Scheduled</div>
          </div>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <a href="/chat" style={{ display: 'block', padding: '1rem', border: '1px solid #2a2a2a', borderRadius: '0.5rem', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>💬 Chat dengan Agents</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Jarvis, Friday, Glass, Epstein</div>
            </a>
            <a href="/team" style={{ display: 'block', padding: '1rem', border: '1px solid #2a2a2a', borderRadius: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>👥 Kelola Team</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Lihat & manage agents</div>
            </a>
            <a href="/memory" style={{ display: 'block', padding: '1rem', border: '1px solid #2a2a2a', borderRadius: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>🧠 Memory</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Access semua context</div>
            </a>
          </div>
        </div>

        {/* Activity Log Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>🧠 Activity Log</h2>
          {events === undefined ? (
            <div style={{ color: '#6b7280', padding: '2rem', textAlign: 'center' }}>Loading...</div>
          ) : events.length === 0 ? (
            <div style={{ color: '#6b7280', padding: '2rem', textAlign: 'center' }}>No events yet. Send a message to OpenClaw!</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {events.slice(0, 10).map((event) => (
                <div key={event._id} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '0.5rem', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {new Date(event.createdAt).toLocaleString()}
                    </span>
                    <span style={{ fontWeight: 600, color: '#4ade80' }}>{event.action}</span>
                    {event.source && (
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>via {event.source}</span>
                    )}
                  </div>
                  {event.prompt && (
                    <div style={{ color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{event.prompt}</div>
                  )}
                  {event.response && (
                    <div style={{ color: '#6b7280', fontSize: '0.8rem', fontStyle: 'italic' }}>{event.response}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
