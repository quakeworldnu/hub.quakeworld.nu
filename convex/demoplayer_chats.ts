import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("demoplayer_chats").take(100);
  },
});

export const add = mutation({
  args: { author: v.string(), content: v.string() },
  handler: async (ctx, { author, content }) => {
    await ctx.db.insert("demoplayer_chats", { author, content });
  },
});
