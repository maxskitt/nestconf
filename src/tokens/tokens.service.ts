import { Injectable } from '@nestjs/common';
import { Token } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private readonly refreshTokenRepository: Repository<Token>,
  ) {}

  async createRefreshToken(userId: number, expiresAt: Date): Promise<Token> {
    const refreshToken = this.refreshTokenRepository.create({
      user: { id: userId },
      expiresAt,
    });

    return this.refreshTokenRepository.save(refreshToken);
  }
  async revokeRefreshToken(token: string): Promise<boolean> {
    const existingToken = await this.refreshTokenRepository.findOne({
      where: { jti: token },
    });

    if (!existingToken || existingToken.revoked) {
      return false;
    }

    await this.refreshTokenRepository.update(
      { id: existingToken.id },
      { revoked: true },
    );
    return true;
  }
}
