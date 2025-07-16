import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Report } from '../../reports/entities/reports.entity';
import { History } from '../../history/entities/history.entity';

@Entity('reporte_historial')
export class ReporteHistorial {
  @PrimaryGeneratedColumn({ name: 'idReporte_historial' })
  idReporteHistorial: number;

  @ManyToOne(() => Report, (reporte) => reporte.reportesHistorial)
  @JoinColumn({ name: 'idReporte' })
  reporte: Report;

  @ManyToOne(() => History, (historial) => historial.reportesHistorial)
  @JoinColumn({ name: 'idHistorial' })
  historial: History;
}
