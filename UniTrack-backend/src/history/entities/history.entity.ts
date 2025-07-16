import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ReporteHistorial } from 'src/report-history/entity/reports-history.entity';

@Entity('historial')
export class History {
  @PrimaryGeneratedColumn({ name: 'idHistorial' })
  idHistorial: number;

  @ManyToOne(() => User, (user) => user.historial)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'idUsuario' })
  usuario: User;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora: string;

  @Column({ length: 50, nullable: true })
  modo?: string;

  @Column({ length: 255, nullable: true })
  hash?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @OneToMany(() => ReporteHistorial, (rh) => rh.historial)
  reportesHistorial: ReporteHistorial[];
}
