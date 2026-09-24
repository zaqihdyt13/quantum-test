import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

describe('AttendanceController', () => {
  let controller: AttendanceController;
  let service: AttendanceService;

  const mockAttendanceService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [
        {
          provide: AttendanceService,
          useValue: mockAttendanceService,
        },
      ],
    }).compile();

    controller = module.get<AttendanceController>(AttendanceController);
    service = module.get<AttendanceService>(AttendanceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an attendance record', async () => {
      const dto: CreateAttendanceDto = {
        attendanceId: 'att-1',
        staffId: 'staff-1',
        checkInTime: '2026-09-22T08:00:00.000Z',
        status: 'Present',
      };
      mockAttendanceService.create.mockResolvedValue({ id: 'uuid-1', ...dto });

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ data: { id: 'uuid-1', ...dto } });
    });
  });

  describe('findAll', () => {
    it('should return all attendances', async () => {
      const options = { page: 1, pageSize: 10 };
      const expectedResult = { attendances: [], count: 0, meta: {} };
      mockAttendanceService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(options as any);
      expect(service.findAll).toHaveBeenCalledWith(options);
      expect(result).toEqual({
        data: expectedResult.attendances,
        count: expectedResult.count,
        meta: expectedResult.meta,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single attendance record', async () => {
      mockAttendanceService.findOne.mockResolvedValue({
        id: 'uuid-1',
        attendanceId: 'att-1',
      });
      const result = await controller.findOne('uuid-1');
      expect(service.findOne).toHaveBeenCalledWith({ id: 'uuid-1' });
      expect(result).toEqual({ data: { id: 'uuid-1', attendanceId: 'att-1' } });
    });
  });

  describe('update', () => {
    it('should update an attendance record', async () => {
      const dto: UpdateAttendanceDto = { status: 'Late' };
      mockAttendanceService.update.mockResolvedValue({
        id: 'uuid-1',
        status: 'Late',
      });
      const result = await controller.update('uuid-1', dto);
      expect(service.update).toHaveBeenCalledWith('uuid-1', dto);
      expect(result).toEqual({ data: { id: 'uuid-1', status: 'Late' } });
    });
  });
});
