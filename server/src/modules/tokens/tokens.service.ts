import { TokensError } from './../../enum/tokens/tokens-error.enum';
import { Account } from './../../models/account.model';
import { RefreshToken } from './../../models/refresh_token.model';
import { AccessToken } from './../../models/access_token.model';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../account/account.service';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { FindOptions } from 'sequelize/types';

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
    @InjectModel(Account)
    private readonly accountRepository: typeof Account,

    @InjectModel(AccessToken)
    private readonly accessTokenRepository: typeof AccessToken,

    @InjectModel(RefreshToken)
    private readonly refreshTokenRepository: typeof RefreshToken,

    private readonly jwtService: JwtService,

    private readonly accountService: AccountService,
  ) {}

  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException({
          error: TokensError.REFRESH_TOKEN_EXPIRED,
        });
      } else {
        throw new UnprocessableEntityException({
          error: TokensError.REFRESH_TOKEN_MALFORMED,
        });
      }
    }
  }

  private async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<RefreshToken | null> {
    const tokenId = payload.jti;

    if (!tokenId) {
      throw new UnprocessableEntityException({
        error: TokensError.REFRESH_TOKEN_MALFORMED,
      });
    }

    return await this.refreshTokenRepository.findOne({
      where: {
        id: tokenId,
      },
    });
  }

  private async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<Account> {
    const subId = payload.sub;

    if (!subId) {
      throw new UnprocessableEntityException({
        error: TokensError.REFRESH_TOKEN_MALFORMED,
      });
    }

    return this.accountService.getAccount({
      where: {
        id: subId,
      },
    });
  }

  public async getAccessToken(
    options: FindOptions<AccessToken>,
  ): Promise<AccessToken | null> {
    return await this.accessTokenRepository.findOne(options);
  }

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

  public async getRefreshToken(
    options: FindOptions<RefreshToken>,
  ): Promise<RefreshToken | null> {
    return await this.refreshTokenRepository.findOne(options);
  }

  public async createRefreshToken(
    accessToken: AccessToken,
    expiresIn: number,
  ): Promise<RefreshToken> {
    const accessTokenModel = await this.accessTokenRepository.findOne({
      where: {
        id: accessToken.id,
      },
      include: [this.accountRepository],
    });

    const dummyRefreshToken = await this.refreshTokenRepository.create({
      token: 'dummy',
      accessToken: accessTokenModel,
    });

    const options: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      subject: String(accessTokenModel.account.id),
      jwtid: dummyRefreshToken.id,
    };

    const refreshToken = await this.jwtService.signAsync({}, options);

    dummyRefreshToken.token = refreshToken;

    return await dummyRefreshToken.save();
  }

  public async resolveRefreshToken(
    encodedToken: string,
  ): Promise<{ account: Account; token: RefreshToken }> {
    const payload = await this.decodeRefreshToken(encodedToken);

    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    if (!token) {
      throw new UnprocessableEntityException({
        error: TokensError.REFRESH_TOKEN_NOT_FOUND,
      });
    }

    if (token.isRevoked) {
      throw new UnprocessableEntityException({
        error: TokensError.REFRESH_TOKEN_REVOKED,
      });
    }

    const account = await this.getUserFromRefreshTokenPayload(payload);

    if (!account) {
      throw new UnprocessableEntityException({
        error: TokensError.REFRESH_TOKEN_MALFORMED,
      });
    }

    return { account, token };
  }
}
