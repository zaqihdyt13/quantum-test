import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthHelper } from 'src/helpers/auth.helper';
import { CustomPassportStrategy } from './passport.strategy';

describe('CustomPassportStrategy', () => {
  let strategy: CustomPassportStrategy;
  let authHelper: AuthHelper;

  const mockAuthHelper = {
    validateUser: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomPassportStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: AuthHelper,
          useValue: mockAuthHelper,
        },
      ],
    }).compile();

    strategy = module.get<CustomPassportStrategy>(CustomPassportStrategy);
    authHelper = module.get<AuthHelper>(AuthHelper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should call authHelper.validateUser with the payload', async () => {
      const payload = { id: 'uuid-1' };
      const expectedUser = { id: 'uuid-1', username: 'testuser' };

      mockAuthHelper.validateUser.mockResolvedValue(expectedUser);

      const result = await strategy.validate(payload);
      expect(authHelper.validateUser).toHaveBeenCalledWith(payload);
      expect(result).toEqual(expectedUser);
    });
  });
});
