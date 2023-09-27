import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { query: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { query = "" } = args;
    let demos: any[] | PromiseLike<any[]>;

    if (query.trim() !== "") {
      demos = await ctx.db
        .query("demobot_demos")
        .withSearchIndex("search_title", (q) => q.search("title", query))
        .take(50);
    } else {
      demos = await ctx.db.query("demobot_demos").order("desc").collect();
      demos.sort((a, b) => {
        return a.timestamp < b.timestamp ? 1 : -1;
      });
    }

    return demos;
  },
});
