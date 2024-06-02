import { z } from "zod";

export const jobListingCreate = z.object({
  title: z.string(),
  description: z.string(),
  skills_required: z.array(z.string().min(1).max(20)),
  salary: z.number(),
  experience: z.string(),
  startDate: z.date(),
  location: z.string(),
});
