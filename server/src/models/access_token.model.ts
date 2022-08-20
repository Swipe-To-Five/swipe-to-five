import { RefreshToken } from './refresh_token.model';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  HasOne,
} from 'sequelize-typescript';
import { Account } from './account.model';

@Table({ tableName: 'access_tokens' })
export class AccessToken extends Model<AccessToken> {
  @Column({ unique: true, type: DataType.TEXT })
  public token: string;

  @Column
  public platform: string;

  @BelongsTo(() => Account)
  public account: Account;

  @HasOne(() => RefreshToken)
  public refreshToken: RefreshToken;

  @ForeignKey(() => Account)
  @Column
  public accountId: number;
}
