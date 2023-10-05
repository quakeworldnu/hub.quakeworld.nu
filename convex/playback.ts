import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Playback } from "./schema.ts";

export function getUpdateTime(): number {
  return Math.round(Date.now() / 1000);
}

export const get = query({
  args: { id: v.id("playback") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const getByGroupId = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, { groupId }) => {
    return await ctx.db
      .query("playback")
      .withIndex("by_group_id", (q) => q.eq("groupId", groupId))
      .first();
  },
});

export const create = mutation({
  args: {
    groupId: v.id("groups"),
    props: v.object({
      updateUserId: v.id("users"),
      url: v.string(),
      time: v.number(),
      autotrack: v.boolean(),
      trackUserid: v.number(),
      speed: v.float64(),
    }),
  },
  handler: async (ctx, { groupId, props }) => {
    console.log(`playback:create(${groupId})`);

    const existing = await getByGroupId(ctx, { groupId });

    if (existing !== null) {
      return existing._id;
    }

    const playback = {
      ...props,
      groupId,
      updateTime: getUpdateTime(),
      hasSyncRequest: false,
    };

    return await ctx.db.insert("playback", playback);
  },
});

export const update = mutation({
  args: {
    id: v.id("playback"),
    props: v.object({
      updateUserId: v.optional(v.id("users")),
      hasSyncRequest: v.optional(v.boolean()),
      url: v.optional(v.string()),
      time: v.optional(v.number()),
      autotrack: v.optional(v.boolean()),
      trackUserid: v.optional(v.number()),
      speed: v.optional(v.float64()),
    }),
  },
  handler: async (ctx, { id, props }) => {
    const newProps: Partial<Playback> = props;
    newProps.updateTime = getUpdateTime();
    return await ctx.db.patch(id, newProps);
  },
});
