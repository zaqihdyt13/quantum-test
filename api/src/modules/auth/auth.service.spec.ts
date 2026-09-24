import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthHelper } from '../../helpers/auth.helper';
import { Staff } from '../staff/entities/staff.entity';
import { Session } from './entities/session.entity';
import * as passwordHelpers from '../../helpers/password.helpers';

// Mock TypeORM entity methods
jest.mock('../staff/entities/staff.entity');
jest.mock('./entities/session.entity');

describe('AuthService', () => {
  let service: AuthService;
  // let jwtService: JwtService;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockAuthHelper = {
    generateToken: jest.fn(),
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: AuthHelper,
          useValue: mockAuthHelper,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    // jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create new staff and return null', async () => {
      const dto = {
        staffId: 'uuid-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'johndoe',
        password: 'password123',
      };

      (
        jest.spyOn(service as any, 'checkUserExist') as jest.SpyInstance
      ).mockResolvedValue(undefined);
      const saveSpy = jest
        .spyOn(Staff.prototype, 'save')
        .mockResolvedValue(null);

      const result = await service.register(dto);

      expect(result).toBeNull();
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      const dto = {
        username: 'johndoe',
        password: 'password123',
      };

      const mockUser = {
        id: 'uuid-1',
        username: 'johndoe',
        passwordHash: 'hashed-password',
      };

      const mockSession = { save: jest.fn() };
      (Session.prototype.save as jest.Mock) = mockSession.save;

      (Staff.findOne as jest.Mock).mockResolvedValue(mockUser);

      // We need to mock validateHash, but since we didn't, let's just make the user passwordHash the actual hashed value or we can mock it
      // Wait, let's just use jest to mock the imported function
      // const passwordHelpers = require('../../helpers/password.helpers');
      jest.spyOn(passwordHelpers, 'validateHash').mockResolvedValue(true);

      mockAuthHelper.generateToken.mockResolvedValue('mock-token');

      const result = await service.login(dto);

      expect(mockAuthHelper.generateToken).toHaveBeenCalled();
      expect(result.accessToken).toEqual('mock-token');

      // passwordHelpers.validateHash.mockRestore();
      (passwordHelpers.validateHash as jest.Mock).mockRestore();
    });

    it('should throw error if credentials are invalid', async () => {
      (Staff.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.login({
          username: 'wrong',
          password: 'wrong',
        }),
      ).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should clear Session on logout', async () => {
      const mockStaff = { id: 'uuid-1', save: jest.fn() };
      (Staff.findOne as jest.Mock).mockResolvedValue(mockStaff);
      (Session.delete as jest.Mock).mockResolvedValue(true);

      await service.logout({ id: 'uuid-1' });

      expect(Staff.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-1' } });
      expect(Session.delete).toHaveBeenCalledWith({ staffId: 'uuid-1' });
    });
  });

  describe('self', () => {
    it('should throw error if user not found', async () => {
      (Staff.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.self({ id: 'uuid-unknown' })).rejects.toThrow();
    });

    it('should return user info without password fields', async () => {
      const mockStaff = {
        id: 'uuid-1',
        username: 'johndoe',
        passwordHash: 'hash',
        accessToken: 'token',
      };
      (Staff.findOne as jest.Mock).mockResolvedValue(mockStaff);

      const result = await service.self({ id: 'uuid-1' });
      expect(result.id).toBe('uuid-1');
      expect((result as any).passwordHash).toBeUndefined();
    });
  });
});
