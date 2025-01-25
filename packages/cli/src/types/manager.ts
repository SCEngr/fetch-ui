import { z } from "zod";

export const InstalledComponentSchema = z.object({
  name: z.string(),
  version: z.string(),
  installPath: z.string(),
  dependencies: z.record(z.string()).optional(),
});

export type InstalledComponent = z.infer<typeof InstalledComponentSchema>;

export interface IComponentManager {
  installComponent(name: string, version?: string): Promise<void>;
  uninstallComponent(name: string): Promise<void>;
  listInstalledComponents(): Promise<InstalledComponent[]>;
  updateComponent(name: string, version: string): Promise<void>;
}
