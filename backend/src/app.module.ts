import { Module } from '@nestjs/common';
import { NftModule } from './nft/nft.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // For .env support
    NftModule,
    PrismaModule,
  ],
})
export class AppModule {}