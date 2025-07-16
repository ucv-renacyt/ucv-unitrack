import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity('qr')
export class QR {
  @PrimaryGeneratedColumn({ name: 'idQr' })
  idQr: number;

  @ManyToOne(() => User, (user) => user.historial, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idUsuario', referencedColumnName: 'idUsuario' })
  usuario: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ name: 'hash', unique: true })
  hash: string;

  @Column({ name: 'url', type: 'text', nullable: true })
  url?: string;

  @Column({ name: 'tipo', type: 'varchar', length: 255, nullable: true })
  tipo?: string;
}
