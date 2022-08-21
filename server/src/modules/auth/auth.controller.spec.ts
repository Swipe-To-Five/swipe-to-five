import { TokensService } from './../tokens/tokens.service';
import { AccountService } from './../account/account.service';
import { Account } from './../../models/account.model';
import { RefreshToken } from './../../models/refresh_token.model';
import { AccessToken } from './../../models/access_token.model';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
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

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

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
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should provide tokens for login', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
    const serviceSpy = jest.spyOn(service, 'loginUsingCredentials');

    await controller.loginUsingCredentials({
      emailAddress: testAccount.emailAddress,
      password: testAccount.password,
      platform: 'example',
    });

    expect(serviceSpy).toBeCalledTimes(1);
  });

  it('should refresh all tokens', async () => {
    const serviceSpy = jest.spyOn(service, 'refreshAllTokens');

    await controller.refreshAllTokens({
      refreshToken: testRefreshToken.token,
    });

    expect(serviceSpy).toBeCalledTimes(1);
  });
});
