import { RefreshToken } from './../../models/refresh_token.model';
import { AccessToken } from './../../models/access_token.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from './tokens.service';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([AccessToken, RefreshToken]),
    JwtModule.register({
      secret: '<SECRET KEY>',
      signOptions: {
        expiresIn: '30s',
      },
    }),
  ],
  providers: [TokensService],
})
export class TokensModule {}
