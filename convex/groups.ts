import { nanoid } from "nanoid";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { demoPlayback } from "./schema.ts";

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

export const getByCode = query({
  args: { code: v.union(v.string(), v.null()) },
  handler: async (ctx, { code }) => {
    console.log(`groups:getByCode(${code})`);

    if (code === null) {
      return null;
    }

    return await ctx.db
      .query("groups")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();
  },
});

export const create = mutation({
  args: { userId: v.id("users"), demoPlayback: demoPlayback },
  handler: async (ctx, { userId, demoPlayback }) => {
    console.log(
      `groups:create(${userId}, demoPlayback: ${JSON.stringify(
        demoPlayback,
        null,
        2,
      )})`,
    );

    const groupId = await ctx.db.insert("groups", {
      code: getCode(3),
      demoPlayback,
    });

    return await ctx.db.patch(userId, { groupId });
  },
});

export const join = mutation({
  args: { userId: v.id("users"), groupId: v.id("groups") },
  handler: async (ctx, { userId, groupId }) => {
    return await ctx.db.patch(userId, { groupId });
  },
});

export const members = query({
  args: { id: v.union(v.id("groups"), v.null()) },
  handler: async (ctx, { id }) => {
    if (id === null) {
      return [];
    }

    return await ctx.db
      .query("users")
      .withIndex("by_group_id", (q) => q.eq("groupId", id))
      .collect();
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
