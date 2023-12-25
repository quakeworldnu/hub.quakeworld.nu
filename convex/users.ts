import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { faker } from "@faker-js/faker";

export const get = query({
  args: { id: v.union(v.id("users"), v.null()) },
  handler: async (ctx, { id }) => {
    console.log(`users:get(${id}`);
    if (id === null) {
      return null;
    }

    return await ctx.db.get(id);
  },
});

export const getByUuid = query({
  args: { uuid: v.union(v.string(), v.null()) },
  handler: async (ctx, { uuid }) => {
    console.log(`users:getByUuid(${uuid}`);
    if (uuid === null) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_uuid", (q) => q.eq("uuid", uuid))
      .first();
  },
});

export const getOrCreate = mutation({
  args: { uuid: v.string() },
  handler: async (ctx, { uuid }) => {
    console.log(`users:getOrCreate(${uuid}`);
    const existing = await getByUuid(ctx, { uuid });
    if (existing !== null) {
      return existing;
    }

    const id = await ctx.db.insert("users", {
      uuid,
      groupId: null,
      name: faker.person.firstName(),
    });

    return await ctx.db.get(id);
  },
});

export const joinGroup = mutation({
  args: { userId: v.id("users"), groupId: v.id("groups") },
  handler: async (ctx, { userId, groupId }) => {
    return await ctx.db.patch(userId, { groupId });
  },
});

export const leaveGroup = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.patch(userId, { groupId: null });
  },
});
