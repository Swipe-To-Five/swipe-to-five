import { AccessToken } from './access_token.model';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'refresh_tokens' })
export class RefreshToken extends Model<RefreshToken> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  public id: string;

  @Column({ unique: true, type: DataType.TEXT })
  public token: string;

  @Column({ defaultValue: false })
  public isRevoked: boolean;

  @BelongsTo(() => AccessToken)
  public accessToken: AccessToken;

  @ForeignKey(() => AccessToken)
  @Column({ type: DataType.UUID })
  public accessTokenId: string;
}
