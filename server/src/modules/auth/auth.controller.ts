import { RefreshTokenDto } from './../../dto/auth/refresh-token.dto';
import { LoginAccountDto } from './../../dto/auth/login-account.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Controller Layer Implementation for Authentication.
 */
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Controller Implementation for account login.
   * @param loginAccountDto DTO Object for logging into account.
   * @returns Access and Refresh tokens.
   */
  @Post('login')
  public async loginUsingCredentials(
    @Body() loginAccountDto: LoginAccountDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.loginUsingCredentials(loginAccountDto);
  }

  /**
   * Controller Implementation for refreshing tokens.
   * @param refreshTokenDto DTO Object for tokens refresh
   * @returns Refreshed access and refresh tokens.
   */
  @Post('refresh')
  public async refreshAllTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.refreshAllTokens(refreshTokenDto);
  }
}
