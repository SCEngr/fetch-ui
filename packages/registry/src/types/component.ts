import { z } from 'zod';

// Component metadata schema
export const ComponentMetadataSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
  author: z.string().optional(),
  license: z.string().optional(),
  repository: z.string().optional(),
  dependencies: z.record(z.string()).optional(),
  peerDependencies: z.record(z.string()).optional(),
  style: z.enum(['default', 'minimal']).optional(),
  typescript: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export type ComponentMetadata = z.infer<typeof ComponentMetadataSchema>;

// Component file schema
export const ComponentFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  type: z.enum(['typescript', 'javascript', 'css', 'scss', 'less', 'json']),
});

export type ComponentFile = z.infer<typeof ComponentFileSchema>;

// Complete component schema
export const ComponentSchema = z.object({
  metadata: ComponentMetadataSchema,
  files: z.array(ComponentFileSchema),
  readme: z.string().optional(),
  changelog: z.string().optional(),
});

export type Component = z.infer<typeof ComponentSchema>;

// Component version schema
export const ComponentVersionSchema = z.object({
  version: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deprecated: z.boolean().optional(),
  deprecationMessage: z.string().optional(),
});

export type ComponentVersion = z.infer<typeof ComponentVersionSchema>;

// API response schemas
export const ComponentListResponseSchema = z.object({
  components: z.array(z.object({
    name: z.string(),
    latestVersion: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })),
  total: z.number(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
});

export type ComponentListResponse = z.infer<typeof ComponentListResponseSchema>;

export const ComponentDetailResponseSchema = z.object({
  component: ComponentSchema,
  versions: z.array(ComponentVersionSchema),
});

export type ComponentDetailResponse = z.infer<typeof ComponentDetailResponseSchema>;

// API error schema
export const APIErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.any().optional(),
});

export type APIError = z.infer<typeof APIErrorSchema>;
