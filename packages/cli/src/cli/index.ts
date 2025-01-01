import { Command } from 'commander';
import { logger } from './logger.js';
import { readFileSync } from 'fs';
import { join } from 'path';

type RegistryType = 'npm' | 'git' | 'local' | 'custom';

const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), 'package.json'), 'utf-8')
);

export class CLI {
  program: Command;

  constructor() {
    this.program = new Command()
      .name('fetch-ui')
      .description('Fetch UI CLI - A tool for managing UI components')
      .version(packageJson.version);

    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .command('add')
      .description('Add a UI component to your project')
      .argument('<component>', 'The component to add')
      .option('-r, --registry <registry>', 'Specify the registry to use (npm|git|local|custom)', 'local')
      .option('-v, --version <version>', 'Specify the component version')
      .option('-f, --force', 'Force install even if the component exists')
      .action((component: string, options: { registry: RegistryType; version?: string; force?: boolean }) => {
        logger.info(`Adding component ${component} from ${options.registry} registry`);
        // TODO: Implement add command using the ComponentManager interface
      });
  }

  async run(args: string[] = process.argv): Promise<void> {
    try {
      await this.program.parseAsync(args);
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error: unknown): void {
    if (error instanceof Error) {
      logger.error(error.message);
    } else {
      logger.error('An unknown error occurred');
    }
    process.exit(1);
  }
}
