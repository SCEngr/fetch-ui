import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { FilesystemStorage } from '../../../src/storage/filesystem'
import { join } from 'path'
import { mkdtemp, rm, readFile, writeFile, mkdir } from 'fs/promises'
import { tmpdir } from 'os'

describe('FilesystemStorage', () => {
  let storage: FilesystemStorage
  let tempDir: string

  beforeEach(async () => {
    // Create a temporary directory for testing
    tempDir = await mkdtemp(join(tmpdir(), 'fetch-ui-test-'))
    storage = new FilesystemStorage(tempDir)
  })

  afterEach(async () => {
    // Clean up temporary directory after tests
    await rm(tempDir, { recursive: true, force: true })
  })

  it('should write and read a file', async () => {
    const path = 'test.txt'
    const content = Buffer.from('Hello, World!')

    await storage.write(path, content)
    const result = await storage.read(path)

    expect(result).toEqual(content)
  })

  it('should list files with given prefix', async () => {
    const files = [
      'components/button/index.ts',
      'components/button/style.css',
      'components/input/index.ts'
    ]

    // Create test files
    for (const file of files) {
      const filePath = join(tempDir, file)
      // Create parent directory
      await mkdir(join(filePath, '..'), { recursive: true })
      await writeFile(filePath, 'test content')
    }

    const result = await storage.list('components/button')
    expect(result).toHaveLength(2)
    expect(result).toContain('components/button/index.ts')
    expect(result).toContain('components/button/style.css')
  })

  it('should delete a file', async () => {
    const path = 'test.txt'
    const content = Buffer.from('Hello, World!')

    await storage.write(path, content)
    await storage.delete(path)

    await expect(storage.read(path)).rejects.toThrow()
  })

  it('should throw error when reading non-existent file', async () => {
    await expect(storage.read('non-existent.txt')).rejects.toThrow()
  })
})
