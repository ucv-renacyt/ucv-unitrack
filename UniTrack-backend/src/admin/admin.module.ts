import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
@Module({
  imports: [TypeOrmModule.forFeature([Admin]), MailModule],
  controllers: [AdminController],
  providers: [AdminService, JwtService],
  exports: [AdminService],
})
export class AdminModule {}
