import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStaffDto } from './create-staff.dto';

export class UpdateStaffDto extends PartialType(CreateStaffDto) {}

// Swagger Wrapper

export class UpdateStaffRequestDataDto {
  @ApiProperty({ example: 'staff' })
  type: string;

  @ApiProperty()
  attributes: UpdateStaffDto;
}
