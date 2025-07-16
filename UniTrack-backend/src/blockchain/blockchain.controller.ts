import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Block } from './entities/block.entity';

import { BlockchainService } from './blockchain.service';
import { AddBlockDto } from './dto/blockchain.dto';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get()
  getChain() {
    return this.blockchainService.getChain();
  }

  @Post('add')
  async addBlock(@Body() addBlockDto: AddBlockDto) {
    return this.blockchainService.addBlock(
      addBlockDto.data,
      addBlockDto.idUsuario,
    );
  }

  @Get('validate')
  validate() {
    return { valid: this.blockchainService.isValid() };
  }

  @Get('exists')
  exists(@Query('hash') hash: string) {
    const exists = this.blockchainService
      .getChain()
      .some((block) => block.hash === hash);
    return { exists };
  }
}
