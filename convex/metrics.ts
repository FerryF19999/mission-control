import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Metrics queries
export const getMetrics = query({
  args: { 
    name: v.optional(v.string()),
    limit: v.optional(v.number()) 
  },
  handler: async (ctx, args) => {
    if (args.name) {
      return await ctx.db.query("metrics")
        .filter((q) => q.eq(q.field("name"), args.name))
        .order("desc")
        .take(args.limit || 100);
    }
    return await ctx.db.query("metrics").order("desc").take(args.limit || 100);
  },
});

export const getLatestMetric = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const metrics = await ctx.db.query("metrics")
      .filter((q) => q.eq(q.field("name"), args.name))
      .order("desc")
      .take(1);
    return metrics[0] || null;
  },
});

// Metrics mutations
export const recordMetric = mutation({
  args: {
    name: v.string(),
    value: v.number(),
    unit: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("metrics", {
      name: args.name,
      value: args.value,
      unit: args.unit,
      timestamp: Date.now(),
    });
  },
});

export const deleteOldMetrics = mutation({
  args: { olderThan: v.number() },
  handler: async (ctx, args) => {
    const oldMetrics = await ctx.db.query("metrics")
      .filter((q) => q.lt(q.field("timestamp"), args.olderThan))
      .collect();
    
    for (const metric of oldMetrics) {
      await ctx.db.delete(metric._id);
    }
    
    return oldMetrics.length;
  },
});
