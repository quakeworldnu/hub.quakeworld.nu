import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, { groupId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_group_id", (q) => q.eq("groupId", groupId))
      .take(5); // dev limit
  },
});

export const add = mutation({
  args: {
    groupId: v.id("groups"),
    name: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { groupId, name, content }) => {
    await ctx.db.insert("messages", { groupId, name, content });
  },
});
