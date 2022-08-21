import { AccountService } from './account.service';
import { Account } from '../../models/account.model';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';

const testAccount = {
  id: 'id',
  emailAddress: 'example@example.com',
  password: 'example',
};

describe('AccountService', () => {
  let service: AccountService;
  let model: typeof Account;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
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
      ],
    }).compile();

    service = testingModule.get<AccountService>(AccountService);
    model = testingModule.get<typeof Account>(getModelToken(Account));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get an account', () => {
    const findSpy = jest.spyOn(model, 'findOne');

    expect(
      service.getAccount({
        where: {
          emailAddress: 'example@example.com',
        },
      }),
    );

    expect(findSpy).toBeCalledWith({
      where: {
        emailAddress: 'example@example.com',
      },
    });

    expect(findSpy).toBeCalledTimes(1);
  });

  it('should create an account', async () => {
    const createSpy = jest.spyOn(model, 'create');

    expect(
      await service.createAccount({
        emailAddress: 'example@example.com',
        password: 'example',
      }),
    ).toEqual(testAccount);

    expect(createSpy).toBeCalledTimes(1);
  });
});
