const mockDebug = jest.fn();
jest.mock('debug', () => () => mockDebug);

import { logger } from './logger.js';

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockDebug.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('info logs message with blue color', () => {
    logger.info('test message');
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('info'), 'test message');
  });

  test('success logs message with green color', () => {
    logger.success('test message');
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('success'), 'test message');
  });

  test('warn logs message with yellow color', () => {
    logger.warn('test message');
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('warning'), 'test message');
  });

  test('error logs message with red color', () => {
    logger.error('test message');
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('error'), 'test message');
  });

  test('debug logs message using debug module', () => {
    const message = 'test debug message';
    logger.debug(message);
    expect(mockDebug).toHaveBeenCalledWith(message);
  });
});
