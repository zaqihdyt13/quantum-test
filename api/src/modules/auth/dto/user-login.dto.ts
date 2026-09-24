import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @ApiProperty()
  readonly username: string;

  @IsString()
  @ApiProperty()
  readonly password: string;
}

// Swagger Wrapper

export class LoginRequestDataDto {
  @ApiProperty({ example: 'auth' })
  type: string;

  @ApiProperty()
  attributes: UserLoginDto;
}

export class LoginRequestDto {
  @ApiProperty()
  data: LoginRequestDataDto;
}
