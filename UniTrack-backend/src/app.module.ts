import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { envConfig } from '@config/env.config';
import { typeOrmModule } from '@config/database.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ReportsModule } from './reports/reports.module';
import { ReportHistoryModule } from './report-history/report-history.module';
import { HistoryModule } from './history/history.module';
import { QrModule } from './qr/qr.module';
import { BlockchainController } from './blockchain/blockchain.controller';
import { BlockchainModule } from './blockchain/blockchain.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    envConfig(),
    typeOrmModule(),
    UsersModule,
    AuthModule,
    ReportHistoryModule,
    HistoryModule,
    QrModule,
    AdminModule,
    MailModule,
    ReportsModule,
    BlockchainModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
