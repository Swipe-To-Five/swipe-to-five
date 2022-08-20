import { Account } from './../../models/account.model';
import { AccountService } from './../account/account.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface AccessTokenPayload {
  sub: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly accountService: AccountService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '<SECRET KEY>',
      signOptions: {
        expiresIn: '30s',
      },
    });
  }

  async validate(payload: AccessTokenPayload): Promise<Account> {
    const { sub: id } = payload;

    const account = await this.accountService.getAccount({
      where: {
        id,
      },
    });

    if (!account) {
      throw new UnauthorizedException('Unauthorized');
    }

    return account;
  }
}
