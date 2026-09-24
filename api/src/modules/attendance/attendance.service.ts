import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceDto } from './dto/attendance.dto';
import { Between, FindOptionsWhere } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { GetAttendanceDto } from './dto/get-attendance.dto';
import { PageMetaDto } from '../../common/dto/page-meta.dto';
import { Staff } from '../staff/entities/staff.entity';

@Injectable()
export class AttendanceService {
  async create(options: CreateAttendanceDto): Promise<Attendance> {
    // VALIDASI KEBERADAAN STAFF ID
    const staff = await Staff.findOne({
      where: { id: options.staffId },
    });

    if (!staff) {
      throw new NotFoundException(`Staff with ID ${options.staffId} not found`);
    }

    const attendance = new Attendance();
    attendance.attendanceId = options.attendanceId;
    attendance.staffId = options.staffId;
    attendance.checkInTime = options.checkInTime
      ? new Date(options.checkInTime)
      : null;
    attendance.checkOutTime = options.checkOutTime
      ? new Date(options.checkOutTime)
      : null;
    attendance.status = options.status || 'Present';
    await attendance.save();

    const createdAttendance = await Attendance.findOne({
      where: { id: attendance.id },
    });
    return createdAttendance;
  }

  async findAll(options: GetAttendanceDto): Promise<{
    attendances: AttendanceDto[];
    count: number;
    meta: PageMetaDto;
  }> {
    const whereFilters: FindOptionsWhere<Attendance> = {};
    if (options.staffId) whereFilters.staffId = options.staffId;
    if (options.status) whereFilters.status = options.status;
    if (options.date) {
      const startOfDay = new Date(`${options.date}T00:00:00.000Z`);
      const endOfDay = new Date(`${options.date}T23:59:59.999Z`);
      whereFilters.checkInTime = Between(startOfDay, endOfDay);
    }

    const page = Number(options.page) || 1;
    const pageSize = Number(options.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const [attendances, count] = await Attendance.findAndCount({
      where: whereFilters,
      take: pageSize,
      skip: skip,
    });

    const meta = new PageMetaDto({
      itemCount: count,
      pageOptionsDto: options,
    });

    const attendanceDto = attendances.map((att) => new AttendanceDto(att));
    return { attendances: attendanceDto, count, meta };
  }

  async findOne(options: { id: string }): Promise<AttendanceDto> {
    const attendance = await Attendance.findOne({
      where: { id: options.id },
    });
    if (!attendance) {
      throw new Error('Attendance record not found');
    }
    return new AttendanceDto(attendance);
  }

  async update(id: string, options: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await Attendance.findOne({
      where: { id },
    });
    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    // VALIDASI KEBERADAAN STAFF ID
    if (options.staffId) {
      const staff = await Staff.findOne({
        where: { id: options.staffId },
      });
      if (!staff) {
        throw new NotFoundException(
          `Staff with ID ${options.staffId} not found`,
        );
      }
      attendance.staffId = options.staffId;
    }

    if (options.attendanceId) attendance.attendanceId = options.attendanceId;
    if (options.staffId) attendance.staffId = options.staffId;
    if (options.checkInTime)
      attendance.checkInTime = new Date(options.checkInTime);
    if (options.checkOutTime)
      attendance.checkOutTime = new Date(options.checkOutTime);
    if (options.status) attendance.status = options.status;

    await attendance.save();

    const updatedAttendance = await Attendance.findOne({
      where: { id: attendance.id },
    });
    return updatedAttendance;
  }
}
