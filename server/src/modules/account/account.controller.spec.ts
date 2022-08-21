import { RECRUITEE } from './../../constants/roles.constant';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { Account } from './../../models/account.model';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

const testAccount = {
  id: 'id',
  emailAddress: 'example@example.com',
  password: 'example',
};

describe('AccountController', () => {
  let controller: AccountController;
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
        AccountController,
      ],
    }).compile();

    controller = testingModule.get<AccountController>(AccountController);
    service = testingModule.get<AccountService>(AccountService);
    model = testingModule.get<typeof Account>(getModelToken(Account));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw an error', async () => {
    expect(
      controller.createAccount({
        emailAddress: 'example@example.com',
        password: 'example',
        role: RECRUITEE,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create an account', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue(null);
    const findOneServiceSpy = jest.spyOn(service, 'getAccount');

    const returnValue = await controller.createAccount({
      emailAddress: 'example@example.com',
      password: 'example',
      role: RECRUITEE,
    });

    expect(findOneServiceSpy).toBeCalledTimes(1);
    expect(findOneServiceSpy).toBeCalledWith({
      where: { emailAddress: 'example@example.com' },
    });
    expect(returnValue).toEqual(testAccount);
  });
});
