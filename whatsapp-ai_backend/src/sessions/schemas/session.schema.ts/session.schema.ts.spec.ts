import { Session } from './session.schema.ts';

describe('Session', () => {
  it('should be defined', () => {
    expect(new Session()).toBeDefined();
  });
});
