import { Account } from './../../models/account.model';
import { RefreshToken } from './../../models/refresh_token.model';
import { AccessToken } from './../../models/access_token.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from './tokens.service';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([AccessToken, RefreshToken, Account]),
    JwtModule.register({
      secret: '<SECRET KEY>',
      signOptions: {
        expiresIn: '15m',
      },
    }),
  ],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
