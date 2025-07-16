import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from './entities/reports.entity';
import { ReporteHistorial } from 'src/report-history/entity/reports-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, ReporteHistorial])],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
