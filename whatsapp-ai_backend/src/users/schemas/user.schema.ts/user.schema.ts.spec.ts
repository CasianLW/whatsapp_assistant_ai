import { User } from './user.schema.ts';

describe('User', () => {
  it('should be defined', () => {
    expect(new User()).toBeDefined();
  });
});
