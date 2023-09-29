import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { id: v.id("demoplayer_users") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const getOrCreate = mutation({
  args: { uuid: v.string() },
  handler: async (ctx, { uuid }) => {
    const existing = await ctx.db
      .query("demoplayer_users")
      .withIndex("by_uuid", (q) => q.eq("uuid", uuid))
      .first();

    if (existing !== null) {
      return existing;
    } else {
      const id = await ctx.db.insert("demoplayer_users", {
        uuid,
        sessionId: null,
        name: "Player",
      });

      return await ctx.db.get(id);
    }
  },
});
