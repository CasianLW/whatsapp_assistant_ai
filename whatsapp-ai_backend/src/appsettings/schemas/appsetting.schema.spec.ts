import { AppSetting } from './appsetting.schema';

describe('AppsettingSchemaTs', () => {
  it('should be defined', () => {
    expect(new AppSetting()).toBeDefined();
  });
});
