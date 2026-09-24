import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { Staff } from '../staff/entities/staff.entity';

jest.mock('./entities/attendance.entity');
jest.mock('../staff/entities/staff.entity');

describe('AttendanceService', () => {
  let service: AttendanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceService],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create attendance successfully', async () => {
      (Staff.findOne as jest.Mock).mockResolvedValue({
        id: 'staff-1',
        email: 'john@example.com',
      });

      (Attendance.findOne as jest.Mock).mockResolvedValue({
        id: 'uuid-new',
        attendanceId: 'att-1',
      });

      const saveMock = jest.fn().mockResolvedValue(true);
      jest.spyOn(Attendance.prototype, 'save').mockImplementation(saveMock);

      const dto = {
        attendanceId: 'att-1',
        staffId: 'staff-1',
        checkInTime: '2026-09-22T08:00:00.000Z',
      };
      const result = await service.create(dto);

      expect(result.id).toBe('uuid-new');
      expect(Attendance.prototype.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a specific attendance record', async () => {
      (Attendance.findOne as jest.Mock).mockResolvedValue({
        id: 'uuid-1',
        attendanceId: 'att-1',
      });
      const result = await service.findOne({ id: 'uuid-1' });
      expect(Attendance.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
      expect(result.attendanceId).toBe('att-1');
    });

    it('should throw if attendance record not found', async () => {
      (Attendance.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.findOne({ id: 'random' })).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should throw if attendance record not found', async () => {
      (Attendance.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.update('random', {})).rejects.toThrow();
    });

    it('should update attendance record successfully', async () => {
      const existingAttendance = {
        id: 'uuid-1',
        status: 'Present',
        save: jest.fn(),
      };

      (Attendance.findOne as jest.Mock)
        .mockResolvedValueOnce(existingAttendance)
        .mockResolvedValueOnce(existingAttendance);

      const result = await service.update('uuid-1', { status: 'Late' });
      expect(existingAttendance.save).toHaveBeenCalled();
      expect(result.id).toBe('uuid-1');
    });
  });
});
