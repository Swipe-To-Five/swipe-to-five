import { AccessToken } from './access_token.model';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'refresh_tokens' })
export class RefreshToken extends Model<RefreshToken> {
  @Column({ unique: true, type: DataType.TEXT })
  public token: string;

  @Column({ defaultValue: false })
  public isRevoked: boolean;

  @BelongsTo(() => AccessToken)
  public accessToken: AccessToken;

  @ForeignKey(() => AccessToken)
  @Column
  public accessTokenId: number;
}
