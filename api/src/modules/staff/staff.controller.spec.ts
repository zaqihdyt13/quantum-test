import { Test, TestingModule } from '@nestjs/testing';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

describe('StaffController', () => {
  let controller: StaffController;
  let service: StaffService;

  const mockStaffService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [
        {
          provide: StaffService,
          useValue: mockStaffService,
        },
      ],
    }).compile();

    controller = module.get<StaffController>(StaffController);
    service = module.get<StaffService>(StaffService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a staff member', async () => {
      const dto: CreateStaffDto = {
        staffId: 'staff-1',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
      };
      mockStaffService.create.mockResolvedValue({ id: 'uuid-1', ...dto });

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ data: { id: 'uuid-1', ...dto } });
    });
  });

  describe('findAll', () => {
    it('should return all staff', async () => {
      const options = { page: 1, pageSize: 10 };
      const expectedResult = { staffs: [], count: 0, meta: {} };
      mockStaffService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(options as any);
      expect(service.findAll).toHaveBeenCalledWith(options);
      expect(result).toEqual({
        data: expectedResult.staffs,
        count: expectedResult.count,
        meta: expectedResult.meta,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single staff', async () => {
      mockStaffService.findOne.mockResolvedValue({
        id: 'uuid-1',
        staffId: 'staff-1',
      });
      const result = await controller.findOne('uuid-1');
      expect(service.findOne).toHaveBeenCalledWith({ id: 'uuid-1' });
      expect(result).toEqual({ data: { id: 'uuid-1', staffId: 'staff-1' } });
    });
  });

  describe('update', () => {
    it('should update a staff member', async () => {
      const dto: UpdateStaffDto = { firstName: 'Jane' };
      mockStaffService.update.mockResolvedValue({
        id: 'uuid-1',
        firstName: 'Jane',
      });
      const mockReq = { user: { id: 'uuid-1' } };
      const result = await controller.update('uuid-1', dto, mockReq as any);
      expect(service.update).toHaveBeenCalledWith('uuid-1', dto);
      expect(result).toEqual({ data: { id: 'uuid-1', firstName: 'Jane' } });
    });
  });
});
