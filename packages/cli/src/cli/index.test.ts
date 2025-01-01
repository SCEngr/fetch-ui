/// <reference types="jest" />
import { CLI } from './index.js';

describe('CLI', () => {
  let cli: CLI;
  let mockExit: jest.SpyInstance;
  let mockConsoleLog: jest.SpyInstance;
  let mockConsoleError: jest.SpyInstance;
  let mockProcess: jest.SpyInstance;

  beforeEach(() => {
    cli = new CLI();
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    mockProcess = jest.spyOn(process, 'cwd').mockReturnValue('/Users/oboo/github/fetch-ui/packages/cli');
  });

  afterEach(() => {
    mockExit.mockRestore();
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
    mockProcess.mockRestore();
    jest.clearAllMocks();
  });

  test('initializes with correct name and description', () => {
    expect(cli.program.name()).toBe('fetch-ui');
    expect(cli.program.description()).toContain('Fetch UI CLI');
  });

  test('handles version flag', async () => {
    const mockOutputHelp = jest.spyOn(cli.program, 'outputHelp').mockImplementation();
    await cli.run(['node', 'fetch-ui', '-V']);
    expect(mockOutputHelp).toHaveBeenCalled();
  });

  test('shows help for add command', async () => {
    await cli.run(['node', 'fetch-ui', 'add', '-h']);
    expect(mockConsoleLog).toHaveBeenCalled();
  });

  test('handles add command with registry option', async () => {
    await cli.run(['node', 'fetch-ui', 'add', 'button', '--registry', 'git']);
    expect(mockConsoleLog).toHaveBeenCalledWith('info', 'Adding component button from git registry');
  });

  test('uses local registry by default', async () => {
    await cli.run(['node', 'fetch-ui', 'add', 'button']);
    expect(mockConsoleLog).toHaveBeenCalledWith('info', 'Adding component button from local registry');
  });

  test('handles add command with all options', async () => {
    await cli.run([
      'node', 'fetch-ui', 'add', 'button',
      '--registry', 'custom',
      '--version', '1.0.0',
      '--force'
    ]);
    expect(mockConsoleLog).toHaveBeenCalledWith('info', 'Adding component button from custom registry');
  });

  test('handles errors gracefully', async () => {
    const error = new Error('Test error');
    cli.handleError(error);
    expect(mockConsoleError).toHaveBeenCalledWith('error', 'Test error');
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test('handles unknown errors gracefully', async () => {
    cli.handleError('Unknown error');
    expect(mockConsoleError).toHaveBeenCalledWith('error', 'An unknown error occurred');
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  test('runs without arguments', async () => {
    const mockOutputHelp = jest.spyOn(cli.program, 'outputHelp').mockImplementation();
    await cli.run(['node', 'fetch-ui']);
    expect(mockOutputHelp).toHaveBeenCalled();
  });
});
