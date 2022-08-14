import { RefreshToken } from './../../models/refresh_token.model';
import { AccessToken } from './../../models/access_token.model';
import { createMockDatabase } from '../../mock/database.mock';
import { Sequelize } from 'sequelize-typescript';
import { AccountService } from './account.service';
import { Account } from '../../models/account.model';

describe('AccountService', () => {
  let service: AccountService;
  let database: Sequelize;

  beforeAll(async () => {
    database = await createMockDatabase([Account, AccessToken, RefreshToken]);

    service = new AccountService(Account);
  });

  afterAll(() => database.close());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    beforeAll(async () => {
      await Account.create({
        emailAddress: 'example@example.com',
        password: 'example',
      });
    });

    afterAll(async () => {
      await Account.truncate();
    });

    it('should create new account', async () => {
      expect(
        await service.createAccount({
          emailAddress: 'example1@example.com',
          password: 'password',
        }),
      ).resolves;
    });

    it('should throw error', async () => {
      expect(
        service.createAccount({
          emailAddress: 'example@example.com',
          password: 'password',
        }),
      ).rejects.toThrow();
    });
  });
});
