import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Case studies live as Markdown in src/content/work/.
 *
 * The schema is enforced at build time: a case study missing `role` or with a
 * non-numeric `year` fails `npm run build` rather than shipping broken. That is
 * the point -- content mistakes get caught before Cloudflare ever sees them.
 */
const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    year: z.number(),
    tags: z.array(z.string()).default([]),
    /** Lower numbers sort first on the work index. */
    order: z.number().default(99),
    /** Set true to keep a work-in-progress case study out of the build. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { work };
