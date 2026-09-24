import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from './staff.service';
import { Staff } from './entities/staff.entity';

jest.mock('./entities/staff.entity');

describe('StaffService', () => {
  let service: StaffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffService],
    }).compile();

    service = module.get<StaffService>(StaffService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should block duplicate email', async () => {
      (Staff.findOne as jest.Mock).mockResolvedValue({ id: 'exist' });
      const dto = {
        email: 'exist@example.com',
        staffId: '1',
        password: 'pass',
        firstName: 'A',
        lastName: 'B',
        username: 'C',
      };

      await expect(service.create(dto)).rejects.toThrow();
    });

    it('should create staff successfully', async () => {
      (Staff.findOne as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'uuid-new', email: 'new@example.com' });

      const saveMock = jest.fn().mockResolvedValue(true);
      jest.spyOn(Staff.prototype, 'save').mockImplementation(saveMock);

      const dto = {
        email: 'new@example.com',
        staffId: '1',
        password: 'pass',
        firstName: 'A',
        lastName: 'B',
        username: 'C',
      };
      const result = await service.create(dto);

      expect(result.id).toBe('uuid-new');
      expect(Staff.prototype.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a specific staff user', async () => {
      (Staff.findOne as jest.Mock).mockResolvedValue({
        id: 'uuid-1',
        firstName: 'John',
      });
      const result = await service.findOne({ id: 'uuid-1' });
      expect(Staff.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-1' } });
      expect(result.id).toBe('uuid-1');
    });

    it('should throw if staff user not found', async () => {
      (Staff.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.findOne({ id: 'random' })).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should throw if staff user not found', async () => {
      (Staff.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.update('random', {})).rejects.toThrow();
    });

    it('should block update with duplicate email', async () => {
      const existingUser = {
        id: 'uuid-1',
        email: 'old@example.com',
        save: jest.fn(),
      };
      const duplicateUser = { id: 'uuid-2', email: 'new@example.com' };

      (Staff.findOne as jest.Mock)
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(duplicateUser);

      await expect(
        service.update('uuid-1', { email: 'new@example.com' }),
      ).rejects.toThrow();
    });

    it('should update staff user successfully', async () => {
      const existingUser = {
        id: 'uuid-1',
        email: 'old@example.com',
        save: jest.fn(),
      };

      (Staff.findOne as jest.Mock)
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(existingUser);

      const result = await service.update('uuid-1', { firstName: 'Jane' });
      expect(existingUser.save).toHaveBeenCalled();
      expect(result.id).toBe('uuid-1');
    });
  });
});
