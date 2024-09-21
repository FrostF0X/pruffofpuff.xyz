import { Controller, Post, Body } from '@nestjs/common';
import { NftService } from './nft.service';

@Controller('nft')
export class NftController {
    constructor(private readonly nftService: NftService) {}

    @Post()
    async createNft(@Body('partnerName') partnerName: string, @Body('puffs') puffs: string[]) {
        return  await this.nftService.createNft(partnerName, puffs);
    }
}
