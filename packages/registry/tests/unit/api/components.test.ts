import 'reflect-metadata';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { app } from '../../../src/app';
import supertest from 'supertest';
import { Component, ComponentMetadata } from '../../../src/types/component';
import { StorageProvider } from '../../../src/storage/interface';
import { FilesystemStorage } from '../../../src/storage/filesystem';
import { mkdtemp, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

describe('Components API', () => {
  let request: supertest.SuperTest<supertest.Test>;
  let storage: StorageProvider;
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'fetch-ui-test-'));
    storage = new FilesystemStorage(tempDir);
    request = supertest(app);
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  describe('GET /components', () => {
    it('should return empty list when no components exist', async () => {
      const response = await request.get('/components');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        components: [],
        total: 0,
      });
    });

    it('should return list of components', async () => {
      // Prepare test data
      const component: Component = {
        metadata: {
          name: 'test-button',
          version: '1.0.0',
          description: 'A test button component',
        },
        files: [
          {
            path: 'index.ts',
            content: 'export const Button = () => {}',
            type: 'typescript',
          },
        ],
      };

      await storage.write(
        'components/test-button/1.0.0/component.json',
        Buffer.from(JSON.stringify(component))
      );

      const response = await request.get('/components');
      
      expect(response.status).toBe(200);
      expect(response.body.components).toHaveLength(1);
      expect(response.body.components[0]).toMatchObject({
        name: 'test-button',
        latestVersion: '1.0.0',
        description: 'A test button component',
      });
    });

    it('should support pagination', async () => {
      // Create multiple components
      const components = Array.from({ length: 15 }, (_, i) => ({
        metadata: {
          name: `test-button-${i}`,
          version: '1.0.0',
        },
        files: [],
      }));

      for (const component of components) {
        await storage.write(
          `components/${component.metadata.name}/1.0.0/component.json`,
          Buffer.from(JSON.stringify(component))
        );
      }

      const response = await request
        .get('/components')
        .query({ page: 2, pageSize: 10 });
      
      expect(response.status).toBe(200);
      expect(response.body.components).toHaveLength(5);
      expect(response.body.total).toBe(15);
      expect(response.body.page).toBe(2);
      expect(response.body.pageSize).toBe(10);
    });
  });

  describe('POST /components', () => {
    it('should create new component', async () => {
      const component: Component = {
        metadata: {
          name: 'test-button',
          version: '1.0.0',
          description: 'A test button component',
        },
        files: [
          {
            path: 'index.ts',
            content: 'export const Button = () => {}',
            type: 'typescript',
          },
        ],
      };

      const response = await request
        .post('/components')
        .send(component);
      
      expect(response.status).toBe(201);
      
      // Verify component was stored
      const stored = await storage.read(
        'components/test-button/1.0.0/component.json'
      );
      expect(JSON.parse(stored.toString())).toMatchObject(component);
    });

    it('should validate component data', async () => {
      const invalid = {
        metadata: {
          // Missing required name
          version: '1.0.0',
        },
        files: [],
      };

      const response = await request
        .post('/components')
        .send(invalid);
      
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        code: 'VALIDATION_ERROR',
      });
    });

    it('should handle version conflicts', async () => {
      const component: Component = {
        metadata: {
          name: 'test-button',
          version: '1.0.0',
        },
        files: [],
      };

      // Create first version
      await request
        .post('/components')
        .send(component);

      // Try to create same version again
      const response = await request
        .post('/components')
        .send(component);
      
      expect(response.status).toBe(409);
      expect(response.body).toMatchObject({
        code: 'VERSION_CONFLICT',
      });
    });
  });

  describe('GET /components/:name', () => {
    it('should return component details', async () => {
      const component: Component = {
        metadata: {
          name: 'test-button',
          version: '1.0.0',
          description: 'A test button component',
        },
        files: [
          {
            path: 'index.ts',
            content: 'export const Button = () => {}',
            type: 'typescript',
          },
        ],
      };

      await storage.write(
        'components/test-button/1.0.0/component.json',
        Buffer.from(JSON.stringify(component))
      );

      const response = await request.get('/components/test-button');
      
      expect(response.status).toBe(200);
      expect(response.body.component).toMatchObject(component);
      expect(response.body.versions).toHaveLength(1);
    });

    it('should return 404 for non-existent component', async () => {
      const response = await request.get('/components/non-existent');
      
      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        code: 'COMPONENT_NOT_FOUND',
      });
    });
  });

  describe('GET /components/:name/versions/:version', () => {
    it('should return specific version', async () => {
      const component: Component = {
        metadata: {
          name: 'test-button',
          version: '1.0.0',
        },
        files: [],
      };

      await storage.write(
        'components/test-button/1.0.0/component.json',
        Buffer.from(JSON.stringify(component))
      );

      const response = await request.get('/components/test-button/versions/1.0.0');
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(component);
    });

    it('should return 404 for non-existent version', async () => {
      const response = await request.get('/components/test-button/versions/999.0.0');
      
      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        code: 'VERSION_NOT_FOUND',
      });
    });
  });
});
