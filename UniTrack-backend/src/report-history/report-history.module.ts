import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportHistoryService as ReporteHistorialService } from './report-history.service';
import { ReporteHistorial } from './entity/reports-history.entity';
import { ReportHistoryController } from './report-history.controller';
import { Report } from 'src/reports/entities/reports.entity';
import { History } from 'src/history/entities/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReporteHistorial, Report, History])],
  controllers: [ReportHistoryController],
  providers: [ReporteHistorialService],
  exports: [ReporteHistorialService],
})
export class ReportHistoryModule {}
