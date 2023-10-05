import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

export const playbackSchema = {
  groupId: v.id("groups"),
  updateTime: v.number(),
  updateUserId: v.id("users"),
  hasSyncRequest: v.boolean(),
  url: v.string(),
  time: v.number(),
  autotrack: v.boolean(),
  trackUserid: v.number(),
  speed: v.float64(),
};

const schema = defineSchema({
  // demos: defineTable({
  //   // file
  //   sha256: v.string(),
  //   filepath: v.string(),
  //   filename: v.string(),
  //   filesize: v.number(),
  //   url: v.string(),
  //   // content
  //   timestamp: v.string(),
  //   duration: v.float64(),
  //   title: v.string(),
  //   mode: v.string(),
  //   map: v.string(),
  //   players: v.array(v.string()),
  //   event: v.string(),
  //   round: v.string(),
  //   bestOf: v.number(),
  //   mapNumber: v.number(),
  // }).index("by_sha256", ["sha256"]),

  groups: defineTable({
    code: v.string(),
  }).index("by_code", ["code"]),

  playback: defineTable(playbackSchema).index("by_group_id", ["groupId"]),

  messages: defineTable({
    groupId: v.id("groups"),
    name: v.string(),
    content: v.string(),
  }).index("by_group_id", ["groupId"]),

  users: defineTable({
    uuid: v.string(),
    name: v.string(),
    groupId: v.union(v.id("groups"), v.null()),
  })
    .index("by_uuid", ["uuid"])
    .index("by_group_id", ["groupId"]),
});
export default schema;

export type Group = Doc<"groups">;
export type GroupId = Id<"groups">;
export type Message = Doc<"messages">;
export type MessageId = Id<"messages">;
export type Playback = Doc<"playback">;
export type PlaybackId = Id<"playback">;
export type User = Doc<"users">;
export type UserId = Id<"users">;
