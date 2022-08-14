import { AccountRepository } from './../../constants/repository.constant';
import { Inject, Injectable } from '@nestjs/common';
import { Account } from 'src/models/account.model';
import { CreateOptions, Optional } from 'sequelize/types';
import { NullishPropertiesOf } from 'sequelize/types/utils';

@Injectable()
export class AccountService {
  constructor(
    @Inject(AccountRepository)
    private readonly accountRepository: typeof Account,
  ) {}

  public async createAccount(
    values?: Optional<Account, NullishPropertiesOf<Account>>,
    options?: CreateOptions<Account>,
  ): Promise<Account | null> {
    return await this.accountRepository.create(values, options);
  }
}
