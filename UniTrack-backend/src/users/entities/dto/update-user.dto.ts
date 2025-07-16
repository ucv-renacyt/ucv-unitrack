import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';
export class UpdateUserDto {
  
  @IsOptional()
  @IsString()
  nombres?: string;

  
  @IsOptional()
  @IsString()
  apellidos?: string;

  
  @IsOptional()
  @IsEmail()
  @Matches(/^[\w-.]+@ucvvirtual\.edu\.pe$/, {
    message:
      'El correo debe ser institucional y terminar en @ucvvirtual.edu.pe',
  })
  correo?: string;

  
  @IsOptional()
  @IsString()
  codigoEstudiante?: string;
}
