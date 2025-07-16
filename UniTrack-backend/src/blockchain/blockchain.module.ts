import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { QrModule } from '../qr/qr.module'; // Importa QrModule

@Module({
  imports: [QrModule], // Agrega aquí
  providers: [BlockchainService],
  controllers: [BlockchainController],
  exports: [BlockchainService],
})
export class BlockchainModule {}
