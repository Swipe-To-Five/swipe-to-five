import { Account } from './../../models/account.model';
import { RefreshToken } from './../../models/refresh_token.model';
import { AccessToken } from './../../models/access_token.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../account/account.service';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';

const BASE_OPTIONS: SignOptions = {
  issuer: 'https://my-app.com',
  audience: 'https://my-app.com',
};

export interface RefreshTokenPayload {
  jti: number;
  sub: number;
}

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(AccessToken)
    private readonly accessTokenRepository: typeof AccessToken,

    @InjectModel(RefreshToken)
    private readonly refreshTokenRepository: typeof RefreshToken,

    private readonly jwtService: JwtService,

    private readonly accountService: AccountService,
  ) {}

  public async createAccessToken(
    account: Account,
    platform: string,
  ): Promise<AccessToken> {
    const options: SignOptions = {
      ...BASE_OPTIONS,
      subject: String(account.id),
    };

    const accessToken = await this.jwtService.signAsync({}, options);

    return await this.accessTokenRepository.create({
      account,
      token: accessToken,
      platform,
    });
  }
}
