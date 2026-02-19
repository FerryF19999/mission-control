# OpenClaw Mission Control

A comprehensive dashboard for managing all OpenClaw agents - inspired by [Alex Finn's concept](https://x.com/AlexFinn/status/2024169334344679783).

![Mission Control Dashboard](screenshot.png)

## Features

### 1. Tasks Board
- Track tasks from all agents (Jarvis, Friday, Glass, Epstein, Yuri)
- Kanban-style board with columns: Pending, In Progress, Done
- Filter by status and search tasks
- Shows task priority and assigned agent

### 2. Calendar
- View all scheduled cron jobs
- List view with job details, schedules, and status
- Calendar view for visual scheduling
- Start/pause job controls

### 3. Memory
- Browse memory files from all agents
- Search through conversations and task history
- Preview file contents
- Filter by agent and file type

### 4. Agent Status
- Real-time status of all agents
- Visual indicators for Online, Busy, Idle, Offline states
- Current task tracking
- System statistics

### 5. Chat/Command
- Direct messaging interface with any agent
- Quick command shortcuts
- Real-time chat simulation
- Agent selector dropdown

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **UI Components**: Lucide React icons
- **State**: React hooks + SWR for data fetching
- **Real-time**: Pusher (configured for future integration)
- **Backend API**: Next.js API Routes

## Installation

```bash
# Clone the repository
git clone https://github.com/FerryF19999/mission-control.git
cd mission-control

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## OpenClaw Integration

The dashboard connects to OpenClaw's filesystem to read:
- Agent configurations from `/root/.openclaw/agents/`
- Cron jobs from `/root/.openclaw/cron/jobs.json`
- Memory files from `/root/.openclaw/memory/` and agent workspaces

## Environment Variables

Create a `.env.local` file:

```env
# Pusher (for real-time updates)
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster

# Optional: OpenClaw API endpoint
OPENCLAW_API_URL=http://localhost:8080
```

## Deployment

### Static Export

```bash
npm run build
# Output will be in ./dist directory
```

### Vercel

```bash
npm i -g vercel
vercel --prod
```

## Agents

| Agent | Role | Status |
|-------|------|--------|
| **Jarvis** | Content & Strategy | Online |
| **Friday** | Development | Busy |
| **Glass** | Memory & Archives | Idle |
| **Epstein** | Testing & QA | Offline |
| **Yuri** | Monitoring | Online |

## Screenshots

### Dashboard Overview
![Dashboard](docs/dashboard.png)

### Tasks Board
![Tasks](docs/tasks.png)

### Calendar
![Calendar](docs/calendar.png)

## Roadmap

- [ ] WebSocket integration for real-time updates
- [ ] Agent command execution via API
- [ ] Task creation and assignment
- [ ] Memory search with vector embeddings
- [ ] Dark/Light theme toggle
- [ ] Mobile responsive improvements

## License

MIT License - See [LICENSE](LICENSE) for details.

## Credits

- Concept by [Alex Finn](https://x.com/AlexFinn/status/2024169334344679783)
- Built by Ferry for the OpenClaw ecosystem
