const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Gateway token from environment or default
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '95e6bf5a720765e27e0637b930f2ea6d1854ae85f3efcbd661a7306ce22f2c30';

// API Routes

// Get all agents
app.get('/api/agents', (req, res) => {
  const agents = [
    { id: 'jarvis', name: 'Jarvis', status: 'online', currentTask: 'Content optimization', lastActive: '2 min ago' },
    { id: 'friday', name: 'Friday', status: 'busy', currentTask: 'Building Mission Control', lastActive: 'Active now' },
    { id: 'glass', name: 'Glass', status: 'idle', currentTask: null, lastActive: '1 hour ago' },
    { id: 'epstein', name: 'Epstein', status: 'offline', currentTask: null, lastActive: '3 hours ago' },
    { id: 'yuri', name: 'Yuri', status: 'online', currentTask: 'Monitoring agents', lastActive: '5 min ago' },
  ];
  res.json({ agents });
});

// Get cron jobs
app.get('/api/cron', (req, res) => {
  try {
    const cronPath = '/root/.openclaw/cron/jobs.json';
    if (fs.existsSync(cronPath)) {
      const cronData = JSON.parse(fs.readFileSync(cronPath, 'utf-8'));
      const jobs = cronData.jobs?.map((job) => ({
        id: job.id,
        name: job.name,
        agent: job.agentId,
        schedule: job.schedule?.kind === 'every' 
          ? `Every ${job.schedule.everyMs / 60000} min`
          : job.schedule?.expr || 'Unknown',
        nextRun: job.state?.nextRunAtMs 
          ? new Date(job.state.nextRunAtMs).toLocaleString()
          : 'Unknown',
        lastRun: job.state?.lastRunAtMs
          ? new Date(job.state.lastRunAtMs).toLocaleString()
          : 'Never',
        status: job.enabled ? 'active' : 'paused',
        lastStatus: job.state?.lastStatus || 'unknown',
        description: job.payload?.message?.substring(0, 100) || 'No description',
      })) || [];
      res.json({ jobs });
    } else {
      res.json({ jobs: [] });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cron jobs' });
  }
});

// Get memory files
app.get('/api/memory', (req, res) => {
  try {
    const files = [];
    const agentNames = ['jarvis', 'friday', 'glass', 'epstein', 'yuri'];
    
    // Check agent workspaces for memory
    for (const agent of agentNames) {
      const agentMemoryDir = path.join('/root/.openclaw', `workspace-${agent}`, 'memory');
      if (fs.existsSync(agentMemoryDir)) {
        const memFiles = fs.readdirSync(agentMemoryDir);
        for (const file of memFiles) {
          if (file.endsWith('.md')) {
            const filePath = path.join(agentMemoryDir, file);
            const stats = fs.statSync(filePath);
            let preview = '';
            try {
              const content = fs.readFileSync(filePath, 'utf-8');
              preview = content.substring(0, 100).replace(/\n/g, ' ');
            } catch (e) {
              preview = 'Unable to read preview';
            }
            
            files.push({
              id: `${agent}-${file}`,
              name: file,
              agent: agent.charAt(0).toUpperCase() + agent.slice(1),
              date: stats.mtime.toISOString().split('T')[0],
              size: `${(stats.size / 1024).toFixed(1)} KB`,
              type: 'conversation',
              preview,
            });
          }
        }
      }
    }
    
    files.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch memory' });
  }
});

// Get tasks
app.get('/api/tasks', (req, res) => {
  const tasks = [
    { id: '1', title: 'Build Mission Control Dashboard', description: 'Create comprehensive dashboard for OpenClaw agent management', status: 'in-progress', assignedBy: 'Ferry', agent: 'Friday', priority: 'high', createdAt: '2026-02-19', dueDate: '2026-02-20' },
    { id: '2', title: 'Content Calendar Optimization', description: 'Optimize Threads posting schedule', status: 'in-progress', assignedBy: 'Ferry', agent: 'Jarvis', priority: 'high', createdAt: '2026-02-19', dueDate: '2026-02-21' },
    { id: '3', title: 'Notion Progress Sync', description: 'Auto-update Notion tasks', status: 'done', assignedBy: 'System', agent: 'Yuri', priority: 'medium', createdAt: '2026-02-18' },
    { id: '4', title: 'Agent Health Monitoring', description: 'Monitor all agents', status: 'in-progress', assignedBy: 'System', agent: 'Yuri', priority: 'medium', createdAt: '2026-02-19' },
  ];
  res.json({ tasks });
});

// Send command to agent via OpenClaw Gateway
app.post('/api/agent/:agentId/command', async (req, res) => {
  const { agentId } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Map agent IDs to workspace names
  const agentWorkspaces = {
    jarvis: 'jarvis',
    friday: 'friday',
    glass: 'glass',
    epstein: 'epstein',
    yuri: 'yuri'
  };

  const workspace = agentWorkspaces[agentId.toLowerCase()];
  if (!workspace) {
    return res.status(400).json({ error: `Unknown agent: ${agentId}` });
  }

  try {
    // Call openclaw CLI to invoke the agent
    const openclawPath = process.env.OPENCLAW_PATH || 'openclaw';
    const args = [
      'invoke',
      '--agent', workspace,
      '--message', message,
      '--token', GATEWAY_TOKEN
    ];

    console.log(`[Agent API] Invoking ${agentId} with message: ${message.substring(0, 50)}...`);

    const result = await new Promise((resolve, reject) => {
      const child = spawn(openclawPath, args, {
        timeout: 120000 // 2 minute timeout
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code !== 0 && code !== null) {
          reject(new Error(`Process exited with code ${code}: ${stderr}`));
        } else {
          resolve(stdout.trim() || stderr.trim());
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });

    res.json({
      success: true,
      agentId,
      response: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[Agent API] Error invoking ${agentId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      agentId
    });
  }
});

// Alternative: Use Gateway HTTP API if available
app.post('/api/agent/:agentId/gateway', async (req, res) => {
  const { agentId } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://127.0.0.1:18788';

    const response = await fetch(`${gatewayUrl}/api/v1/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_TOKEN}`
      },
      body: JSON.stringify({
        agent: agentId,
        message: message
      })
    });

    if (!response.ok) {
      throw new Error(`Gateway returned ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    res.json({
      success: true,
      agentId,
      response: data.response || data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[Agent API] Gateway error for ${agentId}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      agentId
    });
  }
});

// Catch-all for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Mission Control server running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔌 API endpoints:`);
  console.log(`   - GET /api/agents`);
  console.log(`   - GET /api/cron`);
  console.log(`   - GET /api/memory`);
  console.log(`   - GET /api/tasks`);
  console.log(`   - POST /api/agent/:agentId/command - Send command to real agent`);
});
