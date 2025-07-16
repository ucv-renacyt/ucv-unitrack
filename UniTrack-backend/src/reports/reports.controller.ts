import { Controller, Get, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('historial/:idUsuario')
  async historial(@Param('idUsuario') idUsuario: string) {
    return this.reportsService.findByUserId(Number(idUsuario));
  }
}
