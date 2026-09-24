import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import {
  CreateAttendanceDto,
  CreateAttendanceRequestDataDto,
} from './dto/create-attendance.dto';
import {
  UpdateAttendanceDto,
  UpdateAttendanceRequestDataDto,
} from './dto/update-attendance.dto';
import { GetAttendanceDto } from './dto/get-attendance.dto';

@ApiTags('attendances')
@Controller({ version: '1', path: 'attendances' })
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiBody({ type: CreateAttendanceRequestDataDto })
  async create(@Body() options: CreateAttendanceDto) {
    const attendance = await this.attendanceService.create(options);
    return { data: attendance };
  }

  @Get()
  async findAll(@Query(ValidationPipe) options: GetAttendanceDto) {
    const { attendances, count, meta } = await this.attendanceService.findAll(
      options,
    );
    return { data: attendances, count, meta };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const attendance = await this.attendanceService.findOne({ id });
    return { data: attendance };
  }

  @Put(':id')
  @ApiBody({ type: UpdateAttendanceRequestDataDto })
  async update(@Param('id') id: string, @Body() options: UpdateAttendanceDto) {
    const attendance = await this.attendanceService.update(id, options);
    return { data: attendance };
  }
}
