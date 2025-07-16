import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';

@Controller('historial')
export class HistoryController {
  constructor(private readonly HistoryService: HistoryService) {}

  @Get('')
  async historial() {
    return this.HistoryService.findAll();
  }

  @Get('historial/:idUsuario')
  async historialfindByID(@Param('idUsuario') idUsuario: string) {
    return await this.HistoryService.findByUserId(+idUsuario);
  }

  @Post('crear')
  async crear(@Body() dto: CreateHistoryDto) {
    return await this.HistoryService.create(dto);
  }

  @Get('entradas')
  async entradas() {
    return await this.HistoryService.findEntradas();
  }

  @Get('salidas')
  async salidas() {
    return await this.HistoryService.findSalidas();
  }
}
