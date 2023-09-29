import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

export default defineSchema({
  demoplayer_chats: defineTable({
    sessionId: v.id("demoplayer_sessions"),
    name: v.string(),
    content: v.string(),
  }).index("by_session_id", ["sessionId"]),

  demoplayer_sessions: defineTable({
    demoUrl: v.string(),
    playback: v.object({
      time: v.float64(),
      track: v.string(),
      speed: v.float64(),
    }),
  }),

  demoplayer_users: defineTable({
    uuid: v.string(),
    name: v.string(),
    sessionId: v.union(v.id("demoplayer_sessions"), v.null()),
  })
    .index("by_uuid", ["uuid"])
    .index("by_session_id", ["sessionId"]),

  // #################################

  demobot_demos: defineTable({
    sha256: v.string(),
    filepath: v.string(),
    filename: v.string(),
    timestamp: v.string(),
    mode: v.string(),
    map: v.string(),
    title: v.string(),
    event: v.string(),
    round: v.string(),
    best_of: v.float64(),
    map_number: v.float64(),
  }).searchIndex("search_title", {
    searchField: "title",
    filterFields: ["event", "map", "mode"],
  }),

  demobot_playlist: defineTable({
    sha256: v.string(),
    position: v.float64(),
  }),
});

export type ChatMessage = Doc<"demoplayer_chats">;
export type User = Doc<"demoplayer_users">;
export type UserId = Id<"demoplayer_users">;
