import { CreateAccountDto } from './../dto/auth/create-account.dto';
import { AccessToken } from './access_token.model';
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

@Table({ tableName: 'accounts' })
export class Account extends Model<Account> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  public id: string;

  @Column({ unique: true, field: 'email_address' })
  public emailAddress: string;

  @Column({ type: DataType.TEXT, field: 'password' })
  public password: string;

  @HasMany(() => AccessToken)
  public accessTokens: AccessToken[];

  public static async fromDto(
    createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    const account = new Account();

    account.emailAddress = createAccountDto.emailAddress;
    account.password = await bcrypt.hash(createAccountDto.password, 12);

    return account;
  }
}
