import { Injectable } from '@nestjs/common';
import { Block } from './entities/block.entity';
import * as crypto from 'crypto';
import { QrService } from '../qr/qr.service'; // Importa QrService

@Injectable()
export class BlockchainService {
  private chain: Block[] = [];

  constructor(private readonly qrService: QrService) {
    // Inyecta QrService
    this.chain = [this.createGenesisBlock()];
  }

  private createGenesisBlock(): Block {
    const timestamp = Date.now();
    return {
      index: 0,
      timestamp,
      data: 'Genesis Block',
      previousHash: '0',
      hash: this.calculateHash(0, timestamp, 'Genesis Block', '0'),
    };
  }

  private calculateHash(
    index: number,
    timestamp: number,
    data: any,
    previousHash: string,
  ): string {
    return crypto
      .createHash('sha256')
      .update(index + timestamp + JSON.stringify(data) + previousHash)
      .digest('hex');
  }

  getChain(): Block[] {
    return this.chain;
  }

  async addBlock(
    data: any,
    idUsuario: number,
  ): Promise<{ block: Block; qrUrl: string }> {
    const previousBlock = this.chain[this.chain.length - 1];
    const timestamp = Date.now();
    const newBlock: Block = {
      index: previousBlock.index + 1,
      timestamp,
      data,
      previousHash: previousBlock.hash,
      hash: '',
    };
    newBlock.hash = this.calculateHash(
      newBlock.index,
      newBlock.timestamp,
      newBlock.data,
      newBlock.previousHash,
    );
    this.chain.push(newBlock);

    // Generar y registrar QR
    try {
      const qrUrl = await this.qrService.generarCodigoQR(newBlock.hash);
      console.log('addBlock: QR URL generated', qrUrl);

      await this.qrService.registrarQR(
        newBlock.hash,
        idUsuario,
        data.tipo, // This should be 'entrada' or 'salida'
        qrUrl, // This should be the Google Drive URL
      );
      console.log('addBlock: QR registered successfully');

      return { block: newBlock, qrUrl };
    } catch (error) {
      console.error(
        'addBlock: Error during QR generation or registration',
        error,
      );
      throw error;
    }
  }

  isValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];
      if (
        current.hash !==
        this.calculateHash(
          current.index,
          current.timestamp,
          current.data,
          current.previousHash,
        )
      ) {
        return false;
      }
      if (current.previousHash !== previous.hash) {
        return false;
      }
    }
    return true;
  }
}
