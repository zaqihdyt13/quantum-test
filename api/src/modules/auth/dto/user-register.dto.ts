import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class UserRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  staffId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

// Swagger Dto

export class RegisterRequestDataDto {
  @ApiProperty({ example: 'auth' })
  type: string;

  @ApiProperty()
  attributes: UserRegisterDto;
}

export class RegisterRequestDto {
  @ApiProperty()
  data: RegisterRequestDataDto;
}
