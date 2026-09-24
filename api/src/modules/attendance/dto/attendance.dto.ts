import { IsString, IsDate, IsOptional } from 'class-validator';
import { Resource } from 'src/common/resource';
import { Attendance } from '../entities/attendance.entity';

export class AttendanceDto extends Resource {
  @IsString()
  attendanceId: string;

  @IsString()
  staffId: string;

  @IsDate()
  checkInTime: Date;

  @IsDate()
  @IsOptional()
  checkOutTime?: Date;

  @IsString()
  @IsOptional()
  status?: string;

  constructor(partial: Partial<Attendance>) {
    super();
    Object.assign(this, partial);
  }
}
