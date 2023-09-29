import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { sessionId: v.id("demoplayer_sessions") },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query("demoplayer_chats")
      .withIndex("by_session_id", (q) => q.eq("sessionId", sessionId))
      .take(100);
  },
});

export const add = mutation({
  args: {
    sessionId: v.id("demoplayer_sessions"),
    name: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { sessionId, name, content }) => {
    await ctx.db.insert("demoplayer_chats", { sessionId, name, content });
  },
});
