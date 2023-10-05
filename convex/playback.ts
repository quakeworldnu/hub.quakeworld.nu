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
    updateUserId: v.id("users"),
    demo_jump: v.number(),
    demo_setspeed: v.float64(),
    cl_autotrack: v.string(),
    track: v.number(),
  },
  handler: async (ctx, props) => {
    console.log(`playback:create()`);

    const existing = await getByGroupId(ctx, { groupId: props.groupId });

    if (existing !== null) {
      return existing._id;
    }

    const playback = {
      ...props,
      updateTime: getUpdateTime(),
      hasSyncRequest: false,
      url: "todo",
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
      demo_jump: v.optional(v.number()),
      demo_setspeed: v.optional(v.float64()),
      cl_autotrack: v.optional(v.string()),
      track: v.optional(v.number()),
    }),
  },
  handler: async (ctx, { id, props }) => {
    const newProps: Partial<Playback> = props;
    newProps.updateTime = getUpdateTime();
    return await ctx.db.patch(id, newProps);
  },
});
