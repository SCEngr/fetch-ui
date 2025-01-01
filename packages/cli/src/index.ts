import { CLI } from './cli/index.js';
import { logger } from './cli/logger.js';

export async function main(args: string[] = process.argv): Promise<void> {
  const cli = new CLI();
  await cli.run(args);
}

export { CLI } from './cli/index.js';
export { logger } from './cli/logger.js';
