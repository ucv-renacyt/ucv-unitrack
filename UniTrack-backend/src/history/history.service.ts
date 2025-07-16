import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { CreateHistoryDto } from './dto/create-history.dto';
import { HistoryEntryDto } from './dto/history-entry.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async findByUserId(idUsuario: number) {
    return this.historyRepository
      .createQueryBuilder('r')
      .innerJoin('r.usuario', 'u')
      .select([
        'u.idUsuario',
        'u.nombres',
        'u.correo',
        'r.fecha',
        'r.hora',
        'r.modo',
      ])
      .where('u.idUsuario = :idUsuario', { idUsuario })
      .getRawMany();
  }

  async findAll() {
    return await this.historyRepository
      .createQueryBuilder('h')
      .innerJoin('h.usuario', 'u')
      .select([
        'h.idHistorial',
        'h.fecha',
        'h.hora',
        'h.modo',
        'u.idUsuario',
        'u.nombres',
        'u.correo',
      ])
      .getRawMany();
  }

  async create(dto: CreateHistoryDto) {
    const historial = this.historyRepository.create({
      usuario: { idUsuario: dto.idUsuario },
      fecha: dto.fecha,
      hora: dto.hora,
      modo: dto.modo,
      hash: dto.hash,
    });

    return await this.historyRepository.save(historial);
  }

  async findExistingRecord(
    idUsuario: number,
    fecha: string,
    modo: string,
    hash: string,
  ): Promise<History | null> {
    return this.historyRepository.findOne({
      where: {
        usuario: { idUsuario },
        fecha: fecha,
        modo: modo,
        hash: hash,
      },
    });
  }

  async findEntradas(): Promise<HistoryEntryDto[]> {
    const rows = await this.historyRepository
      .createQueryBuilder('h')
      .innerJoin('h.usuario', 'u')
      .select([
        'h.idHistorial',
        'h.fecha',
        'h.hora',
        'h.modo',
        'u.nombres',
        'u.apellidos',
        'u.correo',
      ])
      .where('h.modo = :modo', { modo: 'entrada' })
      .getRawMany();

    return rows.map((row) => ({
      id: row.h_idHistorial,
      nombres: row.u_nombres,
      apellidos: row.u_apellidos,
      correo: row.u_correo,
      fecha: row.h_fecha,
      hora: row.h_hora,
      modo: row.h_modo,
    }));
  }

  async findSalidas(): Promise<HistoryEntryDto[]> {
    const rows = await this.historyRepository
      .createQueryBuilder('h')
      .innerJoin('h.usuario', 'u')
      .select([
        'h.idHistorial',
        'h.fecha',
        'h.hora',
        'h.modo',
        'u.nombres',
        'u.apellidos',
        'u.correo',
      ])
      .where('h.modo = :modo', { modo: 'salida' })
      .getRawMany();

    return rows.map((row) => ({
      id: row.h_idHistorial,
      nombres: row.u_nombres,
      apellidos: row.u_apellidos,
      correo: row.u_correo,
      fecha: row.h_fecha,
      hora: row.h_hora,
      modo: row.h_modo,
    }));
  }
}
