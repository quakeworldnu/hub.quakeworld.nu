import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const playlist = await ctx.db
      .query("demobot_playlist")
      .order("desc")
      .take(100);
    return playlist;
  },
});

export const add = mutation({
  args: { sha256: v.string(), position: v.optional(v.float64()) },
  handler: async (ctx, { sha256, position = 0 }) => {
    await ctx.db.insert("demobot_playlist", { sha256, position });
  },
});

export const remove = mutation({
  args: { id: v.id("demobot_playlist") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
