const logger = require('../utils/logger');

describe('logger utility', () => {
  let logSpy;
  let errorSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('writes structured info logs', () => {
    logger.info('Server started', { port: 3000 });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(logSpy.mock.calls[0][0]);
    expect(payload).toMatchObject({
      level: 'info',
      message: 'Server started',
      port: 3000,
    });
    expect(payload.timestamp).toBeDefined();
  });

  it('writes structured error logs to stderr', () => {
    logger.error('Request failed', { status: 500 });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(errorSpy.mock.calls[0][0]);
    expect(payload).toMatchObject({
      level: 'error',
      message: 'Request failed',
      status: 500,
    });
  });
});
