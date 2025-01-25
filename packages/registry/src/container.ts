import { container } from 'tsyringe';
import { StorageProvider } from './storage/interface';
import { FilesystemStorage } from './storage/filesystem';

// Register dependencies
container.register<StorageProvider>('StorageProvider', {
  useClass: FilesystemStorage,
});

export { container };
