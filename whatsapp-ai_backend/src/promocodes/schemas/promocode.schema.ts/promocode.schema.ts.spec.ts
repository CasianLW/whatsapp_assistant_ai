import { PromoCode } from './promocode.schema.ts';

describe('PromoCode', () => {
  it('should be defined', () => {
    expect(new PromoCode()).toBeDefined();
  });
});
