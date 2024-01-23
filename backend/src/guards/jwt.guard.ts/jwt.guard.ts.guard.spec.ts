import { JwtGuardTsGuard } from './jwt.guard.ts.guard';

describe('JwtGuardTsGuard', () => {
  it('should be defined', () => {
    expect(new JwtGuardTsGuard()).toBeDefined();
  });
});
