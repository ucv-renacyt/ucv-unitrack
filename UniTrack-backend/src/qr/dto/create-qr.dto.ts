import { IsString } from 'class-validator';

export class CreateQrDto {
  @IsString()
  hash: string;

  @IsString()
  tipo: string;
}
