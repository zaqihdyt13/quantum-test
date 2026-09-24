import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  attendanceId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  staffId: string;

  @ApiProperty({ example: '2026-09-22T08:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  checkInTime: string;

  @ApiProperty({ example: '2026-09-22T17:00:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  checkOutTime?: string;

  @ApiProperty({ example: 'Present', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}

// Swagger Wrapper
export class CreateAttendanceRequestDataDto {
  @ApiProperty({ example: 'attendance' })
  type: string;

  @ApiProperty()
  attributes: CreateAttendanceDto;
}

export class CreateAttendanceRequestDto {
  @ApiProperty()
  data: CreateAttendanceRequestDataDto;
}
