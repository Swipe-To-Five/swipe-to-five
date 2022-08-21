import { RECRUITEE, RECRUITER } from './../constants/roles.constant';
import { CreateAccountDto } from './../dto/auth/create-account.dto';
import { AccessToken } from './access_token.model';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

@Table({ tableName: 'accounts' })
export class Account extends Model<Account> {
  @Column({ unique: true, field: 'email_address' })
  public emailAddress: string;

  @Column({ type: DataType.TEXT, field: 'password' })
  public password: string;

  @Column({
    type: DataType.ENUM(RECRUITEE, RECRUITER),
    defaultValue: RECRUITEE,
  })
  public role: string;

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
