import { StorageProvider } from './interface'
import { join, relative } from 'path'
import { mkdir, readFile, writeFile, unlink } from 'fs/promises'
import { readdir } from 'fs/promises'

export class FilesystemStorage implements StorageProvider {
  constructor(private readonly rootDir: string) {}

  async write(path: string, content: Buffer): Promise<void> {
    const fullPath = join(this.rootDir, path)
    await mkdir(join(fullPath, '..'), { recursive: true })
    await writeFile(fullPath, content)
  }

  async read(path: string): Promise<Buffer> {
    const fullPath = join(this.rootDir, path)
    return await readFile(fullPath)
  }

  async list(prefix: string): Promise<string[]> {
    const fullPath = join(this.rootDir, prefix)
    const results: string[] = []

    try {
      const entries = await readdir(fullPath, { recursive: true })
      for (const entry of entries) {
        const entryPath = join(prefix, entry)
        const relativePath = relative(this.rootDir, join(this.rootDir, entryPath))
        results.push(relativePath)
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error
      }
    }

    return results
  }

  async delete(path: string): Promise<void> {
    const fullPath = join(this.rootDir, path)
    await unlink(fullPath)
  }
}
