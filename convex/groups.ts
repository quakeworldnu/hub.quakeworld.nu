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
  args: {},
  handler: async (ctx) => {
    return await ctx.db.insert("groups", {
      code: getCode(3),
      demoPlayback: {
        url: "",
        time: 0,
        autotrack: false,
        trackUserid: 0,
        speed: 100,
      },
    });
  },
});

export const setDemoPlayback = mutation({
  args: { groupId: v.id("groups"), demoPlayback: demoPlayback },
  handler: async (ctx, { groupId, demoPlayback }) => {
    return await ctx.db.patch(groupId, { demoPlayback });
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
