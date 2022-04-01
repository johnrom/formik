let consoleWarnMock: jest.SpyInstance | undefined = undefined;
let consoleErrorMock: jest.SpyInstance | undefined = undefined;

beforeEach(() => {
  consoleWarnMock = jest.spyOn(global.console, 'warn').mockImplementation();
  consoleErrorMock = jest.spyOn(global.console, 'error').mockImplementation();
});

afterEach(() => {
  consoleWarnMock?.mockRestore();
  consoleErrorMock?.mockRestore();
});
