import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAttendanceDto } from './create-attendance.dto';

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {}

// Swagger Wrapper
export class UpdateAttendanceRequestDataDto {
  @ApiProperty({ example: 'attendance' })
  type: string;

  @ApiProperty()
  attributes: UpdateAttendanceDto;
}

export class UpdateAttendanceRequestDto {
  @ApiProperty()
  data: UpdateAttendanceRequestDataDto;
}
