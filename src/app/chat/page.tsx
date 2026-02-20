<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mission Control - Chat</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: white; }
    .app { display: flex; min-height: 100vh; }
    .sidebar { width: 16rem; background: #111; border-right: 1px solid #2a2a2a; padding: 1rem; }
    .logo { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-bottom: 1px solid #2a2a2a; margin-bottom: 1rem; }
    .logo-icon { width: 2.5rem; height: 2.5rem; background: linear-gradient(135deg, #8b5cf6, #ec4899); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; }
    .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 0.75rem; border-radius: 0.5rem; color: #9ca3af; text-decoration: none; margin-bottom: 0.25rem; }
    .nav-item:hover, .nav-item.active { background: #1f2937; color: white; }
    .main { flex: 1; display: flex; flex-direction: column; }
    .chat-container { flex: 1; display: flex; padding: 1rem; gap: 1rem; }
    .agent-list { width: 12rem; background: #111; border-radius: 0.5rem; padding: 0.75rem; }
    .agent-list h3 { font-size: 0.875rem; color: #9ca3af; margin-bottom: 0.75rem; }
    .agent-btn { width: 100%; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border-radius: 0.5rem; background: transparent; border: none; color: #9ca3af; cursor: pointer; text-align: left; margin-bottom: 0.25rem; }
    .agent-btn:hover { background: #1f2937; }
    .agent-btn.active { background: #1f2937; color: white; }
    .chat-area { flex: 1; background: #1a1a1a; border-radius: 0.5rem; display: flex; flex-direction: column; overflow: hidden; }
    .chat-header { padding: 1rem; border-bottom: 1px solid #2a2a2a; }
    .chat-header h2 { font-size: 1rem; font-weight: 600; }
    .chat-header p { font-size: 0.875rem; color: #6b7280; }
    .chat-messages { flex: 1; padding: 1rem; overflow-y: auto; }
    .message { padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 0.5rem; max-width: 80%; }
    .message.user { background: #1f2937; margin-left: auto; }
    .message.agent { background: #374151; margin-right: auto; }
    .message p { font-size: 0.875rem; }
    .chat-input { padding: 1rem; border-top: 1px solid #2a2a2a; display: flex; gap: 0.5rem; }
    .chat-input input { flex: 1; background: #1f2937; border: 1px solid #374151; border-radius: 0.5rem; padding: 0.5rem 1rem; color: white; }
    .chat-input button { padding: 0.5rem 1rem; background: #dc2626; border: none; border-radius: 0.5rem; color: white; cursor: pointer; }
    .chat-input button:disabled { opacity: 0.5; cursor: not-allowed; }
    .typing { color: #9ca3af; font-size: 0.875rem; padding: 0.5rem; }
  </style>
</head>
<body>
  <div class="app">
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-icon"><span>🚀</span></div>
        <div>
          <div style="font-weight:700;font-size:1.125rem">Mission Control</div>
          <div style="font-size:0.75rem;color:#6b7280">OpenClaw Hub</div>
        </div>
      </div>
      <nav>
        <a href="/" class="nav-item">🏠 Dashboard</a>
        <a href="/chat" class="nav-item active">🤖 Chat</a>
        <a href="/tasks" class="nav-item">📋 Tasks</a>
        <a href="/memory" class="nav-item">🧠 Memory</a>
        <a href="/team" class="nav-item">👥 Team</a>
        <a href="/content" class="nav-item">📝 Content</a>
        <a href="/calendar" class="nav-item">📅 Calendar</a>
      </nav>
    </aside>
    <main class="main">
      <div class="chat-container">
        <div class="agent-list">
          <h3>Agents</h3>
          <button class="agent-btn active" onclick="selectAgent('jarvis', '🎯', 'Jarvis', 'Social Media')">
            <span>🎯</span> Jarvis
          </button>
          <button class="agent-btn" onclick="selectAgent('friday', '💻', 'Friday', 'Developer/CTO')">
            <span>💻</span> Friday
          </button>
          <button class="agent-btn" onclick="selectAgent('glass', '🔬', 'Glass', 'Researcher')">
            <span>🔬</span> Glass
          </button>
          <button class="agent-btn" onclick="selectAgent('epstein', '🔍', 'Epstein', 'SEO')">
            <span>🔍</span> Epstein
          </button>
          <button class="agent-btn" onclick="selectAgent('yuri', '🦞', 'Yuri', 'General')">
            <span>🦞</span> Yuri
          </button>
        </div>
        <div class="chat-area">
          <div class="chat-header">
            <h2 id="agentName">🎯 Chat dengan Jarvis</h2>
            <p id="agentRole">Social Media</p>
          </div>
          <div class="chat-messages" id="messages">
            <div class="message agent">
              <p>Halo! Pilih agent dan mulai chat!</p>
            </div>
          </div>
          <div class="chat-input">
            <input type="text" id="msgInput" placeholder="Ketik pesan..." onkeypress="if(event.key==='Enter')sendMessage()">
            <button onclick="sendMessage()" id="sendBtn">Kirim</button>
          </div>
        </div>
      </div>
    </main>
  </div>

  <script>
    const OPENCLAW_URL = 'https://oc-196993-lsur.xc1.app';
    const OPENCLAW_TOKEN = '95e6bf5a720765e27e0637b930f2ea6d1854ae85f3efcbd661a7306ce22f2c30';
    
    let currentAgent = 'jarvis';
    let currentEmoji = '🎯';
    let currentName = 'Jarvis';
    
    function selectAgent(id, emoji, name, role) {
      currentAgent = id;
      currentEmoji = emoji;
      currentName = name;
      document.getElementById('agentName').textContent = emoji + ' Chat dengan ' + name;
      document.getElementById('agentRole').textContent = role;
      document.querySelectorAll('.agent-btn').forEach(b => b.classList.remove('active'));
      event.target.closest('.agent-btn').classList.add('active');
      document.getElementById('messages').innerHTML = '<div class="message agent"><p>Halo! Saya ' + name + '. Ada yang bisa saya bantu?</p></div>';
    }
    
    async function sendMessage() {
      const input = document.getElementById('msgInput');
      const btn = document.getElementById('sendBtn');
      const msg = input.value.trim();
      if (!msg) return;
      
      // Add user message
      const messages = document.getElementById('messages');
      messages.innerHTML += '<div class="message user"><p>' + msg + '</p></div>';
      messages.scrollTop = messages.scrollHeight;
      input.value = '';
      btn.disabled = true;
      
      // Show typing
      messages.innerHTML += '<div class="typing" id="typing">Mengetik...</div>';
      messages.scrollTop = messages.scrollHeight;
      
      try {
        // Call OpenClaw API
        const response = await fetch(OPENCLAW_URL + '/sessions_spawn', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + OPENCLAW_TOKEN,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            agentId: currentAgent,
            task: msg
          })
        });
        
        const data = await response.json();
        document.getElementById('typing').remove();
        
        // Extract response
        let responseText = 'Agent responded';
        if (data.result && data.result.response) {
          responseText = data.result.response;
        } else if (data.response) {
          responseText = data.response;
        }
        
        messages.innerHTML += '<div class="message agent"><p>' + responseText + '</p></div>';
      } catch (err) {
        document.getElementById('typing').remove();
        messages.innerHTML += '<div class="message agent"><p>Error: ' + err.message + '</p></div>';
      }
      
      btn.disabled = false;
      messages.scrollTop = messages.scrollHeight;
    }
  </script>
</body>
</html>
