export const OPENCLAW_URL = "https://oc-196993-lsur.xc1.app";
export const OPENCLAW_TOKEN = "95e6bf5a720765e27e0637b930f2ea6d1854ae85f3efcbd661a7306ce22f2c30";

export const openclawApi = {
  async spawnAgent(agentId, message) {
    const response = await fetch(`${OPENCLAW_URL}/sessions_spawn`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENCLAW_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agentId, task: message }),
    });
    return response.json();
  },

  async getStatus() {
    const response = await fetch(`${OPENCLAW_URL}/status`, {
      headers: { 'Authorization': `Bearer ${OPENCLAW_TOKEN}` },
    });
    return response.json();
  },

  async listSessions() {
    const response = await fetch(`${OPENCLAW_URL}/sessions_list`, {
      headers: { 'Authorization': `Bearer ${OPENCLAW_TOKEN}` },
    });
    return response.json();
  },
};
