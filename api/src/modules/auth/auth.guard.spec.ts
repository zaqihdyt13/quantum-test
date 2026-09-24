import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);
  });

  describe('canActivate', () => {
    it('should allow access if route is public', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(true);
      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({}),
        }),
      } as unknown as ExecutionContext;

      jest
        .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
        .mockResolvedValue(true);

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
    });

    it('should block access if route is not public and no user in request', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(false);
      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({ user: null }),
        }),
      } as unknown as ExecutionContext;

      jest
        .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
        .mockResolvedValue(true);

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(false);
    });

    it('should allow access if route is not public but user exists in request', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(false);
      const mockContext = {
        getHandler: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({ user: { id: 'uuid-1' } }),
        }),
      } as unknown as ExecutionContext;

      jest
        .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
        .mockResolvedValue(true);

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
    });
  });

  describe('handleRequest', () => {
    it('should return user from handleRequest', () => {
      const mockUser = { id: 'uuid-1' };
      expect(guard.handleRequest(null, mockUser as any)).toEqual(mockUser);
    });
  });
});
