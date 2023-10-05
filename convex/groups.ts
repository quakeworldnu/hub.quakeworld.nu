import { nanoid } from "nanoid";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
    });
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
