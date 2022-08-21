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

  /**
   * Decode the refresh token and return the payload.
   * @param token JWT String token
   * @returns Decoded payload
   */
  private async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayload> {
    try {
      // Verify the token.
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

  /**
   * Fetch the token from the database.
   * @param payload JWT Payload.
   * @returns Refresh Token from the database.
   */
  private async getStoredTokenFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<RefreshToken | null> {
    // Getting the token ID.
    const tokenId = payload.jti;

    // If token id does not exist, return error.
    if (!tokenId) {
      throw new UnprocessableEntityException({
        error: TokensError.REFRESH_TOKEN_MALFORMED,
      });
    }

    // Fetch the token from the database.
    return await this.getRefreshToken({
      where: {
        id: tokenId,
      },
    });
  }

  /**
   * Fetch the corresponding account from the token.
   * @param payload JWT Payload
   * @returns Corresponding account.
   */
  private async getUserFromRefreshTokenPayload(
    payload: RefreshTokenPayload,
  ): Promise<Account> {
    // Get the user id from the subject.
    const subId = payload.sub;

    // If subject does not exist, throw an error to the user.
    if (!subId) {
      throw new UnprocessableEntityException({
        error: TokensError.REFRESH_TOKEN_MALFORMED,
      });
    }

    // Fetch and return the user.
    return this.accountService.getAccount({
      where: {
        id: subId,
      },
    });
  }

  /**
   * Service Implementation for fetching access tokens.
   * @param options Find Options for Access Token
   * @returns Access Token.
   */
  public async getAccessToken(
    options: FindOptions<AccessToken>,
  ): Promise<AccessToken | null> {
    options.include = [this.accountRepository, this.refreshTokenRepository];
    return await this.accessTokenRepository.findOne(options);
  }

  /**
   * Service Implementation for creating access tokens.
   * @param account Account trying to login.
   * @param platform Platform used for logging in
   * @returns New access token.
   */
  public async createAccessToken(
    account: Account,
    platform: string,
  ): Promise<AccessToken> {
    // Preparing JWT options
    const options: SignOptions = {
      ...BASE_OPTIONS,
      subject: String(account.id),
    };

    // Generating JWT Access Token
    const accessToken = await this.jwtService.signAsync({}, options);

    // Create a record in the database and return.
    return await this.accessTokenRepository.create({
      account,
      accountId: account.id,
      token: accessToken,
      platform,
    });
  }

  /**
   * Service Implementation for fetching refresh tokens.
   * @param options Find Options for Refresh Tokens.
   * @returns Refresh Token
   */
  public async getRefreshToken(
    options: FindOptions<RefreshToken>,
  ): Promise<RefreshToken | null> {
    options.include = [this.accessTokenRepository];
    return await this.refreshTokenRepository.findOne(options);
  }

  /**
   * Service Implementation for creating refresh tokens.
   * @param accessToken Access Token.
   * @param expiresIn Time of expiry
   * @returns Refresh Token
   */
  public async createRefreshToken(
    accessToken: AccessToken,
    expiresIn: number,
  ): Promise<RefreshToken> {
    // Fetch the access token model from the database.
    const accessTokenModel = await this.accessTokenRepository.findOne({
      where: {
        id: accessToken.id,
      },
      include: [this.accountRepository],
    });

    // Create a dummy token in the database.
    const dummyRefreshToken = await this.refreshTokenRepository.create({
      token: 'dummy',
      accessToken: accessTokenModel,
      accessTokenId: accessTokenModel.id,
    });

    // Preparing JWT options.
    const options: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      subject: String(accessTokenModel.account.id),
      jwtid: String(dummyRefreshToken.id),
    };

    // Create a JWT token.
    const refreshToken = await this.jwtService.signAsync({}, options);

    // Update and return token to the user.
    dummyRefreshToken.token = refreshToken;

    return await dummyRefreshToken.save();
  }

  /**
   * Decode and resolve the refresh token.
   * @param encodedToken Refresh JWT Token.
   * @returns Corresponding account and refresh token.
   */
  public async resolveRefreshToken(
    encodedToken: string,
  ): Promise<{ account: Account; token: RefreshToken }> {
    // Fetch the payload from the token.
    const payload = await this.decodeRefreshToken(encodedToken);

    // Fetch the stored token from the payload.
    const token = await this.getStoredTokenFromRefreshTokenPayload(payload);

    // If token does not exist, throw error.
    if (!token) {
      throw new UnprocessableEntityException({
        error: TokensError.REFRESH_TOKEN_NOT_FOUND,
      });
    }

    // If token is revoked, throw error.
    if (token.isRevoked) {
      throw new UnprocessableEntityException({
        error: TokensError.REFRESH_TOKEN_REVOKED,
      });
    }

    // Fetch the account from the payload.
    const account = await this.getUserFromRefreshTokenPayload(payload);

    // If account does not exist, throw error.
    if (!account) {
      throw new UnprocessableEntityException({
        error: TokensError.REFRESH_TOKEN_MALFORMED,
      });
    }

    // Return account and token.
    return { account, token };
  }

  /**
   * Service Implementation for refreshing access token.
   * @param accessToken Old Access Token
   * @returns New Access Token.
   */
  public async refreshAccessToken(
    accessToken: AccessToken,
  ): Promise<AccessToken> {
    // Fetch the access token from the database.
    const accessTokenModel = await this.accessTokenRepository.findOne({
      where: {
        id: accessToken.id,
      },
      include: [this.accountRepository],
    });

    // Prepare JWT options.
    const options: SignOptions = {
      ...BASE_OPTIONS,
      subject: String(accessTokenModel.accountId),
    };

    // Generate new JWT token.
    const newAccessToken = await this.jwtService.signAsync({}, options);

    // Update and return access token model.
    accessTokenModel.token = newAccessToken;

    return await accessTokenModel.save();
  }

  /**
   * Service Implementation for refreshing refresh token.
   * @param refreshToken Old Refresh Token.
   * @param accessToken New Access Token.
   * @param expiresIn Expiration Time.
   * @returns New Refresh Token.
   */
  public async refreshRefreshToken(
    refreshToken: RefreshToken,
    accessToken: AccessToken,
    expiresIn: number,
  ): Promise<RefreshToken> {
    // Fetch the access token from the database.
    const accessTokenModel = await this.accessTokenRepository.findOne({
      where: {
        id: accessToken.id,
      },
      include: [this.accountRepository],
    });

    // Fetch the refresh token from the database.
    const refreshTokenModel = await this.refreshTokenRepository.findOne({
      where: {
        id: refreshToken.id,
      },
      include: [this.accessTokenRepository],
    });

    // Prepare JWT options.
    const options: SignOptions = {
      ...BASE_OPTIONS,
      expiresIn,
      subject: String(accessTokenModel.account.id),
      jwtid: String(refreshTokenModel.id),
    };

    // Update and return refresh token model.
    const newRefreshToken = await this.jwtService.signAsync({}, options);

    refreshTokenModel.token = newRefreshToken;

    return await refreshTokenModel.save();
  }
}
