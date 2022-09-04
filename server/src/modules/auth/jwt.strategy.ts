import { Account } from './../../models/account.model';
import { AccountService } from './../account/account.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface AccessTokenPayload {
  sub: number;
}

/**
 * Strategy Implementation for verifying access tokens.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly accountService: AccountService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '<SECRET KEY>',
      signOptions: {
        expiresIn: '15m',
      },
    });
  }

  /**
   * Validate token payload and return account.
   * @param payload JWT Payload
   * @returns Logged In Account.
   */
  async validate(payload: AccessTokenPayload): Promise<Account> {
    // Fetch the subject from the payload.
    const { sub: id } = payload;

    // Fetch the corresponding account and check if it exists.
    const account = await this.accountService.getAccount({
      where: {
        id,
      },
    });

    if (!account) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Return account.
    return account;
  }
}
