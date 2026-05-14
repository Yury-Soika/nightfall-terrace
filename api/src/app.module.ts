import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { BackofficeModule } from './admin/admin.module';
import { PublicModule } from './public/public.module';

@Module({
  imports: [DbModule, AuthModule, SeedModule, BackofficeModule, PublicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
