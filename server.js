const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

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
});
