import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';

import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsString()
  @IsOptional()
  nombres?: string;

  @IsString()
  @IsOptional()
  apellidos?: string;

  @IsEmail()
  @IsOptional()
  @Matches(/^[\w-.]+@ucvvirtual\.edu\.pe$/, {
    message:
      'El correo debe ser institucional y terminar en @ucvvirtual.edu.pe',
  })
  correo?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  contrasena?: string;

  @IsString()
  @IsOptional()
  edad?: string;

  @IsString()
  @IsOptional()
  sexo?: string;
}
