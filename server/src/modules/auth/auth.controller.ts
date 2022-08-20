import { RefreshTokenDto } from './../../dto/auth/refresh-token.dto';
import { LoginAccountDto } from './../../dto/auth/login-account.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async loginUsingCredentials(
    @Body() loginAccountDto: LoginAccountDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.loginUsingCredentials(loginAccountDto);
  }

  @Post('refresh')
  public async refreshAllTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.refreshAllTokens(refreshTokenDto);
  }
}
