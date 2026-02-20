import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activityLog: defineTable({
    runId: v.string(),
    action: v.string(),
    prompt: v.optional(v.string()),
    response: v.optional(v.string()),
    source: v.optional(v.string()),
    createdAt: v.number(),
  }),
});
