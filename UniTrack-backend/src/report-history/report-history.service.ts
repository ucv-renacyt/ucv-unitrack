import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReporteHistorial } from './entity/reports-history.entity';

@Injectable()
export class ReportHistoryService {
  constructor(
    @InjectRepository(ReporteHistorial)
    private readonly reporteHistorialRepository: Repository<ReporteHistorial>,
  ) {}
}
