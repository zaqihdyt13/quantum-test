import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ValidationPipe,
  Put,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { GetStaffDto } from './dto/get-staff.dto';
import { CreateStaffRequestDataDto } from './dto/create-staff.dto';
import { UpdateStaffRequestDataDto } from './dto/update-staff.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('staffs')
@Controller({ version: '1', path: 'staffs' })
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @ApiBody({ type: CreateStaffRequestDataDto })
  async create(@Body() options: CreateStaffDto) {
    const staff = await this.staffService.create(options);
    return { data: staff };
  }

  @Get()
  async findAll(@Query(ValidationPipe) options: GetStaffDto) {
    const { staffs, count, meta } = await this.staffService.findAll(options);
    return { data: staffs, count, meta };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const admin = await this.staffService.findOne({ id });

    return { data: admin };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateStaffRequestDataDto })
  async update(
    @Param('id') id: string,
    @Body() options: UpdateStaffDto,
    @Req() req,
  ) {
    const loggedInStaff = req.user;

    // VALIDASI KEPEMILIKAN
    if (loggedInStaff.id !== id) {
      throw new ForbiddenException(
        'You are not permitted to modify other staff members data.',
      );
    }

    const admin = await this.staffService.update(id, options);
    return { data: admin };
  }
}
