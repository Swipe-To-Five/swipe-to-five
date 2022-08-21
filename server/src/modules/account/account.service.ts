import { Injectable } from '@nestjs/common';
import { Account } from '../../models/account.model';
import { CreateOptions, FindOptions, Optional } from 'sequelize/types';
import { NullishPropertiesOf } from 'sequelize/types/utils';
import { InjectModel } from '@nestjs/sequelize';

/**
 * Service Layer Implementation for account.
 */
@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account)
    private readonly accountRepository: typeof Account,
  ) {}

  /**
   * Service Implementation for fetching account.
   * @param options Find Options for Account.
   * @returns Corresponding account or null.
   */
  public async getAccount(
    options: FindOptions<Account>,
  ): Promise<Account | null> {
    return await this.accountRepository.findOne(options);
  }

  /**
   * Service Implementation for creating new account.
   * @param values Value for Account.
   * @param options Create Options for Account.
   * @returns Created account or null.
   */
  public async createAccount(
    values?: Optional<Account, NullishPropertiesOf<Account>>,
    options?: CreateOptions<Account>,
  ): Promise<Account | null> {
    return await this.accountRepository.create(values, options);
  }
}
