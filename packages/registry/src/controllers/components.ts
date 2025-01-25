import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { StorageProvider } from '../storage/interface';
import {
  Component,
  ComponentSchema,
  ComponentListResponseSchema,
  ComponentDetailResponseSchema,
} from '../types/component';
import { APIError } from '../errors';

@injectable()
export class ComponentsController {
  constructor(
    @inject('StorageProvider')
    private storage: StorageProvider
  ) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      // List all component directories
      const componentDirs = await this.storage.list('components');
      const components = [];

      // Get latest version for each component
      for (const dir of componentDirs) {
        const versions = await this.storage.list(`components/${dir}`);
        if (versions.length > 0) {
          const latestVersion = versions.sort().pop()!;
          const componentData = await this.storage.read(
            `components/${dir}/${latestVersion}/component.json`
          );
          const component = JSON.parse(componentData.toString()) as Component;
          components.push({
            name: component.metadata.name,
            latestVersion: component.metadata.version,
            description: component.metadata.description,
            tags: component.metadata.tags,
          });
        }
      }

      // Apply pagination
      const start = (page - 1) * pageSize;
      const paginatedComponents = components.slice(start, start + pageSize);

      const response = ComponentListResponseSchema.parse({
        components: paginatedComponents,
        total: components.length,
        page,
        pageSize,
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const component = ComponentSchema.parse(req.body);
      const { name, version } = component.metadata;

      // Check if version already exists
      try {
        await this.storage.read(
          `components/${name}/${version}/component.json`
        );
        throw new APIError('VERSION_CONFLICT', 'Version already exists');
      } catch (error: any) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }

      // Store component
      await this.storage.write(
        `components/${name}/${version}/component.json`,
        Buffer.from(JSON.stringify(component))
      );

      res.status(201).json(component);
    } catch (error) {
      next(error);
    }
  };

  getDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.params;

      // Get all versions
      const versions = await this.storage.list(`components/${name}`);
      if (versions.length === 0) {
        throw new APIError('COMPONENT_NOT_FOUND', 'Component not found');
      }

      // Get latest version
      const latestVersion = versions.sort().pop()!;
      const componentData = await this.storage.read(
        `components/${name}/${latestVersion}/component.json`
      );
      const component = JSON.parse(componentData.toString()) as Component;

      // Get version details
      const versionDetails = versions.map((version) => ({
        version,
        createdAt: new Date().toISOString(), // TODO: Get actual creation time
        updatedAt: new Date().toISOString(),
      }));

      const response = ComponentDetailResponseSchema.parse({
        component,
        versions: versionDetails,
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getVersion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, version } = req.params;

      try {
        const componentData = await this.storage.read(
          `components/${name}/${version}/component.json`
        );
        const component = ComponentSchema.parse(
          JSON.parse(componentData.toString())
        );
        res.json(component);
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          throw new APIError('VERSION_NOT_FOUND', 'Version not found');
        }
        throw error;
      }
    } catch (error) {
      next(error);
    }
  };
}
