import { Controller, Post, Patch, Get, Param, Body } from '@nestjs/common';
import { NftService } from './nft.service';

@Controller('nft')
export class NftController {
    constructor(private readonly nftService: NftService) {}

    @Post()
    async createNft(@Body('partnerName') partnerName: string, @Body('puffs') puffs: string[]) {
        return await this.nftService.createNft(partnerName, puffs);
    }

    // New endpoint to mark NFT as redeemed and assign new owner address
    @Post('/:identifier/redeemed')
    async redeemNft(@Param('identifier') identifier: string, @Body('newOwnerAddress') newOwnerAddress: string) {
        return await this.nftService.redeemNft(identifier, newOwnerAddress);
    }

    @Patch('/:identifier')
    async updateNftData(
        @Param('identifier') identifier: string,
        @Body() updateData: {
            discord?: string,
            telegram?: string,
            farcaster?: string,
            github?: string,
            username?: string,
            firstName?: string,
            lastName?: string,
            jobTitle?: string,
            tshirtSize?: string
        }
    ) {
        return await this.nftService.updateNftData(identifier, updateData);
    }

    @Patch('/:identifier/connect-dynamic')
    async connectDynamic(
        @Param('identifier') identifier: string,
        @Body('dynamicUserId') dynamicUserId: string
    ) {
        return await this.nftService.connectDynamic(identifier, dynamicUserId);
    }

    // Modified webhook route to use dynamicUserId
    @Post('/webhook')
    async handleWebhook(@Body() payload: any) {
        return await this.nftService.handleWebhook(payload);
    }
    @Get('/:identifier')
    async getNft(@Param('identifier') identifier: string) {
        return await this.nftService.getNft(identifier);
    }
}
