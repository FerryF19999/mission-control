import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/openclaw/event",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    
    await ctx.runMutation(api.events.create, {
      runId: body.runId || "unknown",
      action: body.action || "unknown",
      prompt: body.prompt,
      response: body.response,
      source: body.source,
    });
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }),
});

export default http;
