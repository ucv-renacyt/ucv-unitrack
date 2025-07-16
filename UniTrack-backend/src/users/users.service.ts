import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { QueryFailedError } from 'typeorm';
import { CreateUserDto } from './entities/dto/create-user.dto';
import { UpdateUserDto } from './entities/dto/update-user.dto';
import { MailService } from '../mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UsersService {
  private passwordResetCodes: Map<string, { code: string; expiry: Date }> =
    new Map();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ message?: string; error?: string }> {
    const hashedPassword = await bcrypt.hash(createUserDto.contrasena, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      contrasena: hashedPassword,
    });
    try {
      await this.userRepository.save(user);
      return { message: 'Usuario creado correctamente' };
    } catch (error) {
      // Manejo de errores de duplicidad
      if (
        error instanceof QueryFailedError &&
        error.driverError &&
        error.driverError.code === '23505'
      ) {
        // 23505 = unique_violation en Postgres
        if (error.driverError.detail.includes('correo')) {
          return { error: 'El correo ya está registrado.' };
        }
        if (error.driverError.detail.includes('codigo_estudiante')) {
          return { error: 'El código de estudiante ya está registrado.' };
        }
        return { error: 'Ya existe un usuario con los datos proporcionados.' };
      }
      throw error;
    }
  }

  async findAll(): Promise<
    Array<{
      idUsuario: number;
      nombres: string;
      apellidos: string;
      correo: string;
      codigoEstudiante: string;
    }>
  > {
    const users = await this.userRepository.find({
      select: [
        'idUsuario',
        'nombres',
        'apellidos',
        'correo',
        'codigoEstudiante',
      ],
    });
    return users;
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { idUsuario: id },
      select: [
        'idUsuario',
        'nombres',
        'apellidos',
        'correo',
        'codigoEstudiante',
        'correoA',
        'carrera',
        'ciclo',
        'edad',
        'sexo',
      ],
    });
    if (!user) {
      return { error: 'Usuario no encontrado' };
    }
    return user;
  }

  async findByCorreo(correo: string) {
    const user = await this.userRepository.findOne({
      where: { correo },
      select: [
        'idUsuario',
        'nombres',
        'apellidos',
        'correo',
        'codigoEstudiante',
        'correoA',
        'carrera',
        'ciclo',
        'edad',
        'sexo',
      ],
    });
    if (!user) {
      return { error: 'Usuario no encontrado' };
    }
    return user;
  }

  async login(correo: string, contrasena: string) {
    const user = await this.userRepository.findOne({
      where: { correo },
      select: [
        'idUsuario',
        'nombres',
        'apellidos',
        'correo',
        'codigoEstudiante',
        'contrasena',
        'correoA',
        'carrera',
        'ciclo',
        'edad',
        'sexo',
      ],
    });
    if (!user) {
      return { error: 'Usuario no encontrado' };
    }
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return { error: 'Contraseña incorrecta' };
    }
    // No enviar la contraseña en la respuesta
    const { contrasena: _, ...userWithoutPassword } = user;
    return {
      success: true,
      user: userWithoutPassword,
      access_token: this.jwtService.sign(
        { sub: user.idUsuario },
        { secret: process.env.JWT_SECRET },
      ),
    };
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message?: string; error?: string }> {
    const user = await this.userRepository.findOne({
      where: { idUsuario: id },
    });
    if (!user) {
      return { error: 'Usuario no encontrado' };
    }

    // Validar que el nuevo correo no esté en uso por otro usuario
    if (updateUserDto.correo) {
      const correoExistente = await this.userRepository.findOne({
        where: { correo: updateUserDto.correo },
      });
      if (correoExistente && correoExistente.idUsuario !== id) {
        return { error: 'El correo ya está registrado.' };
      }
    }

    await this.userRepository.update(id, updateUserDto);
    return { message: 'Usuario actualizado correctamente' };
  }

  async remove(id: number): Promise<{ message?: string; error?: string }> {
    const result = await this.userRepository.delete(id);
    if (result.affected && result.affected > 0) {
      return { message: 'Usuario eliminado correctamente' };
    } else {
      return { error: 'Error al eliminar usuario' };
    }
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message?: string; error?: string }> {
    const { correo } = forgotPasswordDto;
    const user = await this.userRepository.findOne({ where: { correo } });

    if (!user) {
      return { error: 'Usuario no encontrado' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // Code valid for 10 minutes
    this.passwordResetCodes.set(correo, { code, expiry });

    const subject = 'Restablecimiento de Contraseña';
    const text = `Su código de restablecimiento de contraseña es: ${code}. Este código es válido por 10 minutos.`;
    const html = `<p>Su código de restablecimiento de contraseña es: <strong>${code}</strong>. Este código es válido por 10 minutos.</p>`;

    try {
      await this.mailService.sendMail(correo, subject, text, html);
      return { message: 'Código de restablecimiento enviado a su correo.' };
    } catch (error) {
      console.error('Error al enviar correo de restablecimiento:', error);
      return { error: 'Error al enviar el correo de restablecimiento.' };
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message?: string; error?: string }> {
    const { correo, code, newPassword } = resetPasswordDto;
    const storedCode = this.passwordResetCodes.get(correo);

    if (!storedCode || storedCode.code !== code) {
      return { error: 'Código inválido o expirado.' };
    }

    if (new Date() > storedCode.expiry) {
      this.passwordResetCodes.delete(correo); // Remove expired code
      return { error: 'Código expirado.' };
    }

    const user = await this.userRepository.findOne({ where: { correo } });
    if (!user) {
      return { error: 'Usuario no encontrado.' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.idUsuario, {
      contrasena: hashedPassword,
    });
    this.passwordResetCodes.delete(correo); // Invalidate code after successful reset

    return { message: 'Contraseña actualizada correctamente.' };
  }
}
