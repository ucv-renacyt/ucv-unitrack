import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddBlockDto {
  @IsNotEmpty()
  data: {
    tipo: string;
    timestamp: string;
  };

  @IsNotEmpty()
  @IsNumber()
  idUsuario: number;
}
