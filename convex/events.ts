import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Event queries
export const getEvents = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const events = await ctx.db.query("events").order("desc").take(args.limit || 100);
    return events;
  },
});

export const getEventsByType = query({
  args: { 
    type: v.union(v.literal("info"), v.literal("warning"), v.literal("error"), v.literal("success")),
    limit: v.optional(v.number()) 
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("events")
      .filter((q) => q.eq(q.field("type"), args.type))
      .order("desc")
      .take(args.limit || 50);
  },
});

// Event mutations
export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("info"), v.literal("warning"), v.literal("error"), v.literal("success")),
    metadata: v.optional(v.record(v.string(), v.any())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", {
      title: args.title,
      description: args.description,
      type: args.type,
      timestamp: Date.now(),
      metadata: args.metadata,
    });
  },
});

export const deleteEvent = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
