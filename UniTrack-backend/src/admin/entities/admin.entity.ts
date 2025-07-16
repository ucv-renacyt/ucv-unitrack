import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('administrador')
export class Admin {
  @PrimaryGeneratedColumn({ name: 'idAdmin' })
  idAdmin: number;

  @Column({ length: 50 })
  nombres: string;

  @Column({ length: 50 })
  apellidos: string;

  @Column({ length: 100, unique: true })
  correo: string;

  @Column({ length: 255 })
  contrasena: string;

  @Column({ length: 50 })
  edad: string;

  @Column({ length: 50 })
  sexo: string;
}
