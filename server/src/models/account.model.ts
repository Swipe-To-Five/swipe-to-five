import { AccessToken } from './access_token.model';
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

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
}
