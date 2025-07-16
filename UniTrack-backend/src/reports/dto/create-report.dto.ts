import {
    IsDateString,
    IsInt,
    IsPositive,
    ValidateNested,
    ArrayMinSize,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { CreateReporteHistorialDto } from 'src/report-history/dto/create-reporte-historial.dto';
  
  export class CreateReportDto {
    @IsInt()
    @IsPositive()
    idAdmin: number;
  
    @IsDateString()
    fecha: string;
  
    @ValidateNested({ each: true })
    @Type(() => CreateReporteHistorialDto)
    @ArrayMinSize(1)
    reportesHistorial: CreateReporteHistorialDto[];
  }
  