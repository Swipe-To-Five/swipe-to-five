import { RefreshTokenDto } from './../../dto/auth/refresh-token.dto';
import { getOneMonthLater } from './../../utils/time.util';
import { AuthError } from './../../enum/auth/auth-error.enum';
import { Account } from './../../models/account.model';
import { LoginAccountDto } from './../../dto/auth/login-account.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { TokensService } from '../tokens/tokens.service';
import * as bcrypt from 'bcrypt';

/**
 * Service layer Implementation for Authentication.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly tokenService: TokensService,
  ) {}

  /**
   * Check existence and validate the given credentials.
   * @param loginAccountDto DTO Object for login account.
   * @returns Corresponding account.
   */
  private async validateAndFetchAccount(
    loginAccountDto: LoginAccountDto,
  ): Promise<Account> {
    // Check if account exists in the database.
    const checkAccount = await this.accountService.getAccount({
      where: {
        emailAddress: loginAccountDto.emailAddress,
      },
    });

    if (!checkAccount) {
      throw new BadRequestException({
        message: AuthError.ACCOUNT_DOES_NOT_EXISTS,
      });
    }

    // Check if passwords match.
    const isPasswordMatching = await bcrypt.compare(
      loginAccountDto.password,
      checkAccount.password,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException({
        message: AuthError.WRONG_PASSWORD,
      });
    }

    // Return account.
    return checkAccount;
  }

  /**
   * Generate access and refresh tokens for the user to use.
   * @param account User details trying to login.
   * @param platform Platform from where the user is trying to login.
   * @returns Access and Refresh tokens.
   */
  private async generateTokensForLogin(
    account: Account,
    platform: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Generate a new access token for the corresponding user.
    const accessToken = await this.tokenService.createAccessToken(
      account,
      platform,
    );

    // Generate a new refresh token for the corresponding access token.
    const refreshToken = await this.tokenService.createRefreshToken(
      accessToken,
      getOneMonthLater().getTime(),
    );

    // Return the tokens.
    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    };
  }

  /**
   * Service Implementation for account login.
   * @param loginAccountDto DTO Implementation for account login.
   * @returns Access and Refresh Tokens.
   */
  public async loginUsingCredentials(
    loginAccountDto: LoginAccountDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Validate and fetch the corresponding user.
    const account = await this.validateAndFetchAccount(loginAccountDto);

    // Return corresponding tokens.
    return await this.generateTokensForLogin(account, loginAccountDto.platform);
  }

  /**
   * Service Implementation for refreshing access token.
   * @param refreshTokenDto DTO Implementation for refreshing access token.
   * @returns Refreshed tokens.
   */
  public async refreshAllTokens(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Read and resolve the refresh token.
    const { account, token: refreshToken } =
      await this.tokenService.resolveRefreshToken(refreshTokenDto.refreshToken);

    // Generate a new access token.
    const newAccessToken = await this.tokenService.refreshAccessToken(
      refreshToken.accessToken,
    );

    // Generate a corresponding refresh token.
    const newRefreshToken = await this.tokenService.refreshRefreshToken(
      refreshToken,
      refreshToken.accessToken,
      getOneMonthLater().getTime(),
    );

    // Return tokens.
    return {
      accessToken: newAccessToken.token,
      refreshToken: newRefreshToken.token,
    };
  }
}
