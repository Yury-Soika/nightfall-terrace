import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loadEnv } from '../config/env';

loadEnv();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
})
export class DbModule {}
