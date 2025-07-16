import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsEmail()
  @IsNotEmpty()
  @Matches(/^[\w-.]+@ucvvirtual\.edu\.pe$/, {
    message:
      'El correo debe ser institucional y terminar en @ucvvirtual.edu.pe',
  })
  correo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  contrasena: string;

  @IsString()
  @IsNotEmpty()
  edad: string;

  @IsString()
  @IsNotEmpty()
  sexo: string;
}
