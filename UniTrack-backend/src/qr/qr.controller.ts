import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { QrService } from './qr.service';
import { VerificarQrDto } from './dto/verificar-qr.dto';

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Get('historial/:idUsuario')
  async historial(@Param('idUsuario') idUsuario: string) {
    return this.qrService.findByUserId(Number(idUsuario));
  }

  @Get('generar')
  async generar(@Query('hash') hash: string, @Query('tipo') tipo: string) {
    const mensaje = await this.qrService.generarCodigoQR(hash);
    return { mensaje };
  }

  @Post('verificar')
  async verificarImagen(@Body() body: { imagePath: string; tipo: string }) {
    try {
      const hash = await this.qrService.verificarImagenQR(body.imagePath);
      const usuario = await this.qrService.obtenerUsuarioPorHash(hash);

      if (!usuario) {
        return { error: 'No se encontró un usuario asociado a este código QR' };
      }
      return { hash }; // Solo retorna el hash
    } catch (error) {
      if (error.message === 'QR ya utilizado') {
        return { error: 'QR ya utilizado', alreadyUsed: true };
      }
      return { error: error.message };
    }
  }

  @Post('verificarExpiracion')
  async verificar(@Body() body: VerificarQrDto) {
    try {
      const mensaje = await this.qrService.verificarCodigoQRConExpiracion(
        body.hash,
        5,
      );
      const qr = await this.qrService.obtenerQRporHash(body.hash);
      return { mensaje, qrUrl: qr?.url ?? null };
    } catch (error) {
      if (error.message === 'QR ya utilizado') {
        return { error: 'QR ya utilizado', alreadyUsed: true };
      }
      return { error: error.message };
    }
  }

  @Post('usuario-por-qr')
  async usuarioPorQr(@Body() body: { idUsuario: number }) {
    const qrUrl = await this.qrService.obtenerQRUrlPorUsuario(body.idUsuario);
    if (!qrUrl) {
      return { error: 'No se encontró un QR para este usuario' };
    }
    return { qrUrl };
  }

  @Post('registrar')
  async registrarQr(
    @Body('hash') hash: string,
    @Body('idUsuario') idUsuario: number,
    @Body('tipo') tipo: string,
    @Body('url') url: string,
  ) {
    try {
      const qr = await this.qrService.registrarQR(hash, idUsuario, tipo, url);
      return { message: 'QR registrado exitosamente', qr };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('latest-qr-type')
  async getLatestQrType(@Body('idUsuario') idUsuario: number) {
    try {
      const latestQr = await this.qrService.findLatestQrByUserId(idUsuario);
      if (latestQr) {
        return { tipo: latestQr.tipo };
      } else {
        return { tipo: null };
      }
    } catch (error) {
      return { error: error.message };
    }
  }
}
