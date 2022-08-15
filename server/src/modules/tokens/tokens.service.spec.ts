import { Account } from './../../models/account.model';
import { RefreshToken } from './../../models/refresh_token.model';
import { AccessToken } from './../../models/access_token.model';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { AccountService } from '../account/account.service';

const testAccessToken = {
  id: 'id',
  token: 'token',
  platform: 'platform',
};

const testRefreshToken = {
  id: 'id',
  token: 'token',
  platform: 'platform',
};

const testAccount = {
  id: 'id',
  emailAddress: 'example@example.com',
  password: 'example',
};

describe('TokensService', () => {
  let service: TokensService;
  let accessTokenModel: typeof AccessToken;

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
      ],
    }).compile();

    service = module.get<TokensService>(TokensService);
    accessTokenModel = module.get<typeof AccessToken>(
      getModelToken(AccessToken),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new access token', async () => {
    const createSpy = jest.spyOn(accessTokenModel, 'create');

    const mockResult = await service.createAccessToken(
      testAccount as Account,
      'test',
    );

    expect(mockResult).toEqual(testAccessToken);
    expect(createSpy).toBeCalledTimes(1);
  });
});
