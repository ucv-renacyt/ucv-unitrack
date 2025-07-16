import { IsInt, IsPositive } from 'class-validator';

export class CreateReporteHistorialDto {
  @IsInt()
  @IsPositive()
  idHistorial: number;
}
