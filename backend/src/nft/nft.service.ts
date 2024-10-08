import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { create } from 'ipfs-http-client';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NftService {
    private ipfs;

    constructor(private prisma: PrismaService, private configService: ConfigService) {
        this.ipfs = create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            headers: {
                authorization: 'Basic ' + Buffer.from(`${this.configService.get('INFURA_PROJECT_ID')}:${this.configService.get('INFURA_PROJECT_SECRET')}`).toString('base64')
            }
        });
    }

    async createNft(partnerName: string, puffs: string[]) {
        const metadata = {
            name: 'NFT Token ' + uuidv4().toString(),
            description: 'A simple NFT token',
            partnerName,
            puffs,
            image: 'https://static-url-for-image.com/static-image.png'
        };

        // Upload to IPFS
        const { cid } = await this.ipfs.add(JSON.stringify(metadata));
        const identifier = cid.toString();

        // Generate Ethereum wallet
        const wallet = ethers.Wallet.createRandom();
        const privateKey = wallet.privateKey;

        // Save NFT data to database
        const nft = await this.prisma.nFT.create({
            data: {
                identifier,
                partnerName,
                puffs,
                imageUrl: metadata.image,
                privateKey,
            }
        });

        return { identifier, privateKey};
    }

    // Method to mark NFT as redeemed and update the new owner address
    async redeemNft(identifier: string, newOwnerAddress: string) {
        return await this.prisma.nFT.update({
            where: { identifier },
            data: { redeemed: true, ownerAddress: newOwnerAddress },
        });
    }

    async updateNftData(identifier: string, updateData: {
        discord?: string,
        telegram?: string,
        farcaster?: string,
        github?: string,
        username?: string,
        firstName?: string,
        lastName?: string,
        jobTitle?: string,
        tshirtSize?: string
    }) {
        return await this.prisma.nFT.update({
            where: { identifier },
            data: updateData,
        });
    }

    async connectDynamic(identifier: string, dynamicUserId: string) {
        return await this.prisma.nFT.update({
            where: { identifier },
            data: { dynamicUserId },
        });
    }

    // Modified webhook handler to identify using dynamicUserId
    async handleWebhook(payload: any) {
        const { data } = payload;

        // Extract the fields from the payload
        const telegramUsername = data.accountUsername;
        const telegramImageUrl = data.accountPhotos && data.accountPhotos.length > 0 ? data.accountPhotos[0] : null;
        const dynamicUserId = data.userId as string; // Assuming the dynamic user ID is in the payload

        // Update the NFT entry based on dynamicUserId
        return await this.prisma.nFT.update({
            where: { dynamicUserId },
            data: {
                telegramUsername,
                telegramImageUrl,
            },
        });
    }
    // Method to get all NFT data by identifier
    async getNft(identifier: string) {
        return await this.prisma.nFT.findUnique({
            where: { identifier },
        });
    }
}
