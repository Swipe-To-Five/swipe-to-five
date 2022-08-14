import { Provider } from '@nestjs/common';
import { AccountRepository } from 'src/constants/repository.constant';
import { Account } from 'src/models/account.model';

export const repositoryProvider: Provider<any>[] = [
  {
    provide: AccountRepository,
    useValue: Account,
  },
];
