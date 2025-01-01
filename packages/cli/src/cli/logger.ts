import chalk from 'chalk';
import Debug from 'debug';

const debug = Debug('fetch-ui');

export const logger = {
  info: (message: string): void => {
    console.log(chalk.blue('info'), message);
  },
  success: (message: string): void => {
    console.log(chalk.green('success'), message);
  },
  warn: (message: string): void => {
    console.warn(chalk.yellow('warning'), message);
  },
  error: (message: string): void => {
    console.error(chalk.red('error'), message);
  },
  debug: (message: string): void => {
    debug(message);
  },
};
