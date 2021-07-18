import { ReportDto } from './../models/report.dto';
import { Controller, Get, Query } from '@nestjs/common';
import { GetReportDto } from 'src/models/report.dto';
import { ReportsService } from 'src/services/reports.service';

@Controller('api/reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Get()
  async getList(@Query() query: GetReportDto): Promise<ReportDto> {
    return await this.reportService.get(query);
  }
}