import { main, CLI, logger } from './index.js';
import { CLI as OriginalCLI } from './cli/index.js';
import { logger as originalLogger } from './cli/logger.js';

jest.mock('./cli/index.js');

describe('CLI Entry Point', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('main function creates CLI instance and runs it', async () => {
    const mockRun = jest.fn();
    (CLI as jest.Mock).mockImplementation(() => ({
      run: mockRun
    }));

    const args = ['node', 'fetch-ui', 'test'];
    await main(args);

    expect(CLI).toHaveBeenCalled();
    expect(mockRun).toHaveBeenCalledWith(args);
  });

  test('main function uses process.argv by default', async () => {
    const mockRun = jest.fn();
    (CLI as jest.Mock).mockImplementation(() => ({
      run: mockRun
    }));

    await main();

    expect(CLI).toHaveBeenCalled();
    expect(mockRun).toHaveBeenCalledWith(process.argv);
  });

  test('exports CLI class', () => {
    expect(CLI).toBeDefined();
    expect(CLI).toBe(OriginalCLI);
  });

  test('exports logger', () => {
    expect(logger).toBeDefined();
    expect(logger).toBe(originalLogger);
  });
});
