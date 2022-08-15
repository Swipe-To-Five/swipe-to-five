import { Injectable } from '@nestjs/common';
import { Account } from '../../models/account.model';
import { CreateOptions, FindOptions, Optional } from 'sequelize/types';
import { NullishPropertiesOf } from 'sequelize/types/utils';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account)
    private readonly accountRepository: typeof Account,
  ) {}

  public async getAccount(
    options: FindOptions<Account>,
  ): Promise<Account | null> {
    return await this.accountRepository.findOne(options);
  }

  public async createAccount(
    values?: Optional<Account, NullishPropertiesOf<Account>>,
    options?: CreateOptions<Account>,
  ): Promise<Account | null> {
    return await this.accountRepository.create(values, options);
  }
}
