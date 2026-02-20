<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mission Control</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0a0a0a; 
      color: white;
    }
    .app { display: flex; min-height: 100vh; }
    .sidebar { 
      width: 16rem; 
      background: #111; 
      border-right: 1px solid #2a2a2a;
      padding: 1rem;
    }
    .logo { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-bottom: 1px solid #2a2a2a; }
    .logo-icon { width: 2.5rem; height: 2.5rem; background: linear-gradient(135deg, #8b5cf6, #ec4899); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; }
    .nav { padding: 0.75rem; }
    .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 0.75rem; border-radius: 0.5rem; color: #9ca3af; text-decoration: none; margin-bottom: 0.25rem; }
    .nav-item:hover { background: rgba(255,255,255,0.05); }
    .nav-item.active { background: #1f2937; color: white; }
    .main { flex: 1; padding: 1.5rem; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .header h1 { font-size: 1.875rem; font-weight: 700; }
    .status { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #111; border-radius: 9999px; font-size: 0.875rem; }
    .status-dot { width: 0.5rem; height: 0.5rem; background: #22c55e; border-radius: 50%; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 0.75rem; padding: 1.25rem; }
    .card-icon { width: 2.5rem; height: 2.5rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
    .card-value { font-size: 1.875rem; font-weight: 700; }
    .card-label { font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem; }
    .section { margin-bottom: 2rem; }
    .section-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="app">
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-icon"><span style="font-size:1.25rem">🚀</span></div>
        <div>
          <div style="font-weight:700;font-size:1.125rem">Mission Control</div>
          <div style="font-size:0.75rem;color:#6b7280">OpenClaw Hub</div>
        </div>
      </div>
      <nav class="nav">
        <a href="/chat" class="nav-item">🤖 Chat</a>
        <a href="/tasks" class="nav-item">📋 Tasks</a>
        <a href="/memory" class="nav-item">🧠 Memory</a>
        <a href="/team" class="nav-item">👥 Team</a>
        <a href="/content" class="nav-item">📝 Content</a>
        <a href="/calendar" class="nav-item">📅 Calendar</a>
      </nav>
    </aside>
    <main class="main">
      <div class="header">
        <h1>Welcome to Mission Control 🚀</h1>
        <div class="status">
          <div class="status-dot"></div>
          <span>4/5 Agents Active</span>
        </div>
      </div>
      
      <div class="grid">
        <div class="card">
          <div class="card-icon" style="background: linear-gradient(135deg, #06b6d4, #3b82f6)">🤖</div>
          <div class="card-value">5</div>
          <div class="card-label">Active Agents</div>
        </div>
        <div class="card">
          <div class="card-icon" style="background: linear-gradient(135deg, #8b5cf6, #ec4899)">📋</div>
          <div class="card-value">12</div>
          <div class="card-label">Tasks Today</div>
        </div>
        <div class="card">
          <div class="card-icon" style="background: linear-gradient(135deg, #f59e0b, #f97316)">🧠</div>
          <div class="card-value">48</div>
          <div class="card-label">Memories</div>
        </div>
        <div class="card">
          <div class="card-icon" style="background: linear-gradient(135deg, #22c55e, #10b981)">📅</div>
          <div class="card-value">8</div>
          <div class="card-label">Scheduled</div>
        </div>
      </div>
      
      <div class="section">
        <h2 class="section-title">Quick Actions</h2>
        <div class="grid">
          <a href="/chat" class="card" style="display:block;text-decoration:none;color:inherit">
            <div class="card-icon" style="background: linear-gradient(135deg, #8b5cf6, #ec4899)">💬</div>
            <div style="font-weight:600;margin-bottom:0.25rem">Chat dengan Agents</div>
            <div style="font-size:0.875rem;color:#6b7280"> Jarvis, Friday, Glass, Epstein</div>
          </a>
          <a href="/team" class="card" style="display:block;text-decoration:none;color:inherit">
            <div class="card-icon" style="background: linear-gradient(135deg, #06b6d4, #3b82f6)">👥</div>
            <div style="font-weight:600;margin-bottom:0.25rem">Kelola Team</div>
            <div style="font-size:0.875rem;color:#6b7280">Lihat & manage agents</div>
          </a>
          <a href="/memory" class="card" style="display:block;text-decoration:none;color:inherit">
            <div class="card-icon" style="background: linear-gradient(135deg, #f59e0b, #f97316)">🧠</div>
            <div style="font-weight:600;margin-bottom:0.25rem">Memory</div>
            <div style="font-size:0.875rem;color:#6b7280">Access semua context</div>
          </a>
        </div>
      </div>
    </main>
  </div>
</body>
</html>
