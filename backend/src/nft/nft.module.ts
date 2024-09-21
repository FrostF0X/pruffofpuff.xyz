import { Module } from '@nestjs/common';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule], // Import PrismaModule and ConfigModule
  controllers: [NftController],
  providers: [NftService],
})
export class NftModule {}
