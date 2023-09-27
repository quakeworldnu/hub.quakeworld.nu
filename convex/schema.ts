import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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

  demoplayer_chats: defineTable({
    author: v.string(),
    content: v.string(),
  }),

  demoplayer_sessions: defineTable({
    playback_timestamp: v.float64(),
    uid: v.string(),
  }),
});
