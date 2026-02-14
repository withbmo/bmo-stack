import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  framework: z.string(),
  region: z.string(),
  status: z.enum(["running", "stopped", "building", "error"]),
  lastDeployed: z.string(),
  cpuUsage: z.number().optional(),
  memoryUsage: z.number().optional(),
});

export const ProjectsListSchema = z.array(ProjectSchema);

export type Project = z.infer<typeof ProjectSchema>;
