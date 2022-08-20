import { getOneMonthLater } from './../../utils/time.util';
import { AuthError } from './../../enum/auth/auth-error.enum';
import { Account } from './../../models/account.model';
import { LoginAccountDto } from './../../dto/auth/login-account.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { TokensService } from '../tokens/tokens.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly tokenService: TokensService,
  ) {}

  private async validateAndFetchAccount(
    loginAccountDto: LoginAccountDto,
  ): Promise<Account> {
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

    const isPasswordMatching = await bcrypt.compare(
      loginAccountDto.password,
      checkAccount.password,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException({
        message: AuthError.WRONG_PASSWORD,
      });
    }

    return checkAccount;
  }

  private async generateTokensForLogin(
    account: Account,
    platform: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.tokenService.createAccessToken(
      account,
      platform,
    );

    const refreshToken = await this.tokenService.createRefreshToken(
      accessToken,
      getOneMonthLater().getTime(),
    );

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    };
  }

  public async loginUsingCredentials(
    loginAccountDto: LoginAccountDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const account = await this.validateAndFetchAccount(loginAccountDto);
    return await this.generateTokensForLogin(account, loginAccountDto.platform);
  }
}
