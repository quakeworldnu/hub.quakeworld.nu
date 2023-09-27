import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getFirst = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("demoplayer_sessions").first();
  },
});

export const update = mutation({
  args: { id: v.id("demoplayer_sessions"), playback_timestamp: v.float64() },
  handler: async (ctx, args) => {
    const { id, playback_timestamp } = args;

    await ctx.db.patch(id, { playback_timestamp });
  },
});
