import { TokensService } from './../tokens/tokens.service';
import { AccountService } from './../account/account.service';
import { Account } from './../../models/account.model';
import { RefreshToken } from './../../models/refresh_token.model';
import { AccessToken } from './../../models/access_token.model';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

const testAccount = {
  id: 'id',
  emailAddress: 'example@example.com',
  password: 'example',
};

const testAccessToken = {
  id: 'id',
  token: 'token',
  platform: 'platform',
  account: testAccount,
  save: jest.fn(() => testAccessToken),
};

const testRefreshToken = {
  id: 'id',
  token: 'token',
  platform: 'platform',
  accessToken: testAccessToken,
  save: jest.fn(() => testRefreshToken),
};

describe('AuthService', () => {
  let service: AuthService;
  let accountService: AccountService;
  let tokensService: TokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: '<SECRET KEY>',
          signOptions: {
            expiresIn: '30s',
          },
        }),
      ],
      providers: [
        {
          provide: getModelToken(AccessToken),
          useValue: {
            findAll: jest.fn(() => [testAccessToken]),
            findOne: jest.fn(() => testAccessToken),
            create: jest.fn(() => testAccessToken),
            remove: jest.fn(),
          },
        },
        {
          provide: getModelToken(RefreshToken),
          useValue: {
            findAll: jest.fn(() => [testRefreshToken]),
            findOne: jest.fn(() => testRefreshToken),
            create: jest.fn(() => testRefreshToken),
            remove: jest.fn(),
          },
        },
        {
          provide: getModelToken(Account),
          useValue: {
            findAll: jest.fn(() => [testAccount]),
            findOne: jest.fn(() => testAccount),
            create: jest.fn(() => testAccount),
            remove: jest.fn(),
          },
        },
        AccountService,
        TokensService,
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    accountService = module.get<AccountService>(AccountService);
    tokensService = module.get<TokensService>(TokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should provide tokens for login', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
    const accountSpy = jest.spyOn(accountService, 'getAccount');
    const accessTokenSpy = jest.spyOn(tokensService, 'createAccessToken');
    const refreshTokenSpy = jest.spyOn(tokensService, 'createRefreshToken');

    await service.loginUsingCredentials({
      emailAddress: testAccount.emailAddress,
      password: testAccount.password,
      platform: 'example',
    });

    expect(accountSpy).toBeCalledTimes(1);
    expect(accessTokenSpy).toBeCalledTimes(1);
    expect(refreshTokenSpy).toBeCalledTimes(1);
  });

  it('should refresh all tokens', async () => {
    const resolveRefreshTokenSpy = jest.spyOn(
      tokensService,
      'resolveRefreshToken',
    );
    const newAccessTokenSpy = jest.spyOn(tokensService, 'refreshAccessToken');
    const newRefreshTokenSpy = jest.spyOn(tokensService, 'refreshRefreshToken');

    await service.refreshAllTokens({
      refreshToken: testRefreshToken.token,
    });

    expect(resolveRefreshTokenSpy).toBeCalledTimes(1);
    expect(newAccessTokenSpy).toBeCalledTimes(1);
    expect(newRefreshTokenSpy).toBeCalledTimes(1);
  });
});
