"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  const events = useQuery(api.events.list);

  if (events === undefined) {
    return (
      <div className="container">
        <h1>🧠 Activity Log</h1>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="container">
        <h1>🧠 Activity Log</h1>
        <div className="empty">No events yet. Send a message to OpenClaw!</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>🧠 Activity Log ({events.length})</h1>
      {events.map((event) => (
        <div key={event._id} className="event">
          <div className="event-header">
            <span className="event-time">
              {new Date(event.createdAt).toLocaleString()}
            </span>
            <span className="event-action">{event.action}</span>
            {event.source && (
              <span style={{ color: "#666", fontSize: "0.8rem" }}>
                via {event.source}
              </span>
            )}
          </div>
          {event.prompt && <div className="event-prompt">{event.prompt}</div>}
          {event.response && (
            <div className="event-response">{event.response}</div>
          )}
        </div>
      ))}
    </div>
  );
}
