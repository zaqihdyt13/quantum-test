import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    self: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const dto: UserRegisterDto = {
        staffId: 'uuid-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        password: 'password123',
      };

      mockAuthService.register.mockResolvedValue(true);

      const result = await controller.register(dto);
      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        data: { message: 'Register Success, please login to continue.' },
      });
    });
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const dto: UserLoginDto = {
        username: 'johndoe',
        password: 'password123',
      };
      const expectedLoginResult = {
        accessToken: 'token',
        user: { id: 'uuid-1' },
      };

      mockAuthService.login.mockResolvedValue(expectedLoginResult);

      const result = await controller.login(dto);
      expect(service.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ data: expectedLoginResult });
    });
  });

  describe('selfUser', () => {
    it('should return self user data', async () => {
      const req = { user: { id: 'uuid-1' } } as any;
      const expectedSelf = { id: 'uuid-1', username: 'johndoe' };

      mockAuthService.self.mockResolvedValue(expectedSelf);

      const result = await controller.selfUser(req);
      expect(service.self).toHaveBeenCalledWith({ id: 'uuid-1' });
      expect(result).toEqual({ data: expectedSelf });
    });
  });

  describe('logout', () => {
    it('should logout a user successfully', async () => {
      const req = { user: { id: 'uuid-1' } } as any;

      mockAuthService.logout.mockResolvedValue(true);

      const result = await controller.logout(req);
      expect(service.logout).toHaveBeenCalledWith({ id: 'uuid-1' });
      expect(result).toEqual({ data: { message: 'Logout successfully' } });
    });
  });
});
