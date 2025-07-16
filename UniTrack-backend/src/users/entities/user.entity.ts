import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { History } from '../../history/entities/history.entity';
@Entity('usuario')
export class User {
  
  @PrimaryGeneratedColumn({ name: 'idUsuario' })
  idUsuario: number;

  
  @Column({ length: 50 })
  nombres: string;

  
  @Column({ length: 50 })
  apellidos: string;

  
  @Column({ length: 100, unique: true })
  correo: string;

  
  @Column({ name: 'codigo_estudiante', length: 20, unique: true })
  codigoEstudiante: string;

  
  @Column({ length: 255 })
  contrasena: string;

  
  @Column({ name: 'correoA', length: 50, nullable: true })
  correoA?: string;

  
  @Column({ length: 50 })
  carrera: string;

  
  @Column({ length: 50 })
  ciclo: string;

  
  @Column({ length: 50 })
  edad: string;

  
  @Column({ length: 50 })
  sexo: string;

  
  @OneToMany(() => History, (history) => history.usuario)
  historial: History[];
}
