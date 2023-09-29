import { nanoid } from "nanoid";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { GroupId } from "./schema.ts";

export const getCode = (size: number) => nanoid(size).toUpperCase();

export const get = query({
  args: { id: v.union(v.id("groups"), v.null()) },
  handler: async (ctx, { id }) => {
    console.log(`groups:get(${id})`);

    if (id === null) {
      return null;
    }

    return await ctx.db.get(id);
  },
});

export const join = mutation({
  args: { userId: v.id("users"), code: v.optional(v.string()) },
  handler: async (ctx, { userId, code }) => {
    console.log(`groups:join(${userId}, ${code})`);

    const user = await ctx.db.get(userId);
    if (null === user) {
      return;
    }

    const code_ = code?.toUpperCase() || getCode(6);

    const existingGroup = await ctx.db
      .query("groups")
      .withIndex("by_code", (q) => q.eq("code", code_))
      .first();

    let groupId: GroupId;

    if (existingGroup === null) {
      groupId = await ctx.db.insert("groups", {
        code: code_,
        playback: {
          url: "",
          time: 0,
          track: "",
          speed: 1,
        },
      });
    } else {
      groupId = existingGroup._id;
    }

    return await ctx.db.patch(userId, { groupId });
  },
});

export const leave = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);

    if (null === user || user.groupId === null) {
      return;
    }

    return await ctx.db.patch(userId, { groupId: null });
  },
});
