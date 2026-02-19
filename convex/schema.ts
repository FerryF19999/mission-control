import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("info"), v.literal("warning"), v.literal("error"), v.literal("success")),
    timestamp: v.number(),
    metadata: v.optional(v.record(v.string(), v.any())),
  }),
  
  metrics: defineTable({
    name: v.string(),
    value: v.number(),
    unit: v.optional(v.string()),
    timestamp: v.number(),
  }),
});
