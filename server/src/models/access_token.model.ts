import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Account } from './account.model';

@Table({ tableName: 'access_tokens' })
export class AccessToken extends Model<AccessToken> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  public id: string;

  @Column({ unique: true, type: DataType.TEXT })
  public token: string;

  @Column
  public platform: string;

  @BelongsTo(() => Account)
  public account: Account;

  @ForeignKey(() => Account)
  @Column({ type: DataType.UUID })
  public accountId: string;
}
