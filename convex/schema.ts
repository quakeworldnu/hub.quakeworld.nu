import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

export default defineSchema({
  messages: defineTable({
    groupId: v.id("groups"),
    name: v.string(),
    content: v.string(),
  }).index("by_group_id", ["groupId"]),

  groups: defineTable({
    code: v.string(),
    playback: v.object({
      url: v.string(),
      time: v.float64(),
      track: v.string(),
      speed: v.float64(),
    }),
  }).index("by_code", ["code"]),

  users: defineTable({
    uuid: v.string(),
    name: v.string(),
    groupId: v.union(v.id("groups"), v.null()),
  })
    .index("by_uuid", ["uuid"])
    .index("by_group_id", ["groupId"]),
});

export type Group = Doc<"groups">;
export type GroupId = Id<"groups">;
export type Message = Doc<"messages">;
export type MessageId = Id<"messages">;
export type User = Doc<"users">;
export type UserId = Id<"users">;
