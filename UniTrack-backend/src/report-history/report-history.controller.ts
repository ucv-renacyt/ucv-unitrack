import { Controller, Get, Param } from '@nestjs/common';
import { ReportHistoryService } from './report-history.service';

@Controller('reporte-historial')
export class ReportHistoryController {
  constructor(private readonly reportHistoryService: ReportHistoryService) {}

  @Get('historial/:idUsuario')
  async historial(@Param('idUsuario') idUsuario: string) {
    return '';
  }
}
