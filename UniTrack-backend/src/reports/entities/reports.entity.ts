import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Admin } from 'src/admin/entities/admin.entity';
import { ReporteHistorial } from 'src/report-history/entity/reports-history.entity';

@Entity('reporte')
export class Report {
  @PrimaryGeneratedColumn({ name: 'idReporte' })
  idReporte: number;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'idAdmin' })
  admin: Admin;

  @Column({ type: 'date' })
  fecha: string;

  @OneToMany(() => ReporteHistorial, (rh) => rh.reporte)
  reportesHistorial: ReporteHistorial[];
}
