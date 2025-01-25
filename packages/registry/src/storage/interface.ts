/**
 * Storage provider interface for component registry
 */
export interface StorageProvider {
  /**
   * Write content to a path
   * @param path Relative path to write to
   * @param content Content to write
   */
  write(path: string, content: Buffer): Promise<void>;

  /**
   * Read content from a path
   * @param path Relative path to read from
   * @returns Content buffer
   * @throws If file does not exist
   */
  read(path: string): Promise<Buffer>;

  /**
   * List all files under a prefix
   * @param prefix Prefix to list under
   * @returns Array of relative paths
   */
  list(prefix: string): Promise<string[]>;

  /**
   * Delete a file at path
   * @param path Path to delete
   */
  delete(path: string): Promise<void>;
}
