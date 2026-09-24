import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class CreateStaffDto {
  @ApiProperty()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message:
      'staffId must only contain alphanumeric characters (no spaces or special characters)',
  })
  staffId: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

// Swagger Wrapper

export class CreateStaffRequestDataDto {
  @ApiProperty({ example: 'staff' })
  type: string;

  @ApiProperty()
  attributes: CreateStaffDto;
}

export class CreateStaffRequestDto {
  @ApiProperty()
  data: CreateStaffDto;
}
