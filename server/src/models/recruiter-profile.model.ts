import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Account } from './account.model';
import { RecruiteeProfile } from './recruitee-profile.model';

@Table({ tableName: 'recruiter_profiles' })
export class RecruiterProfile extends Model<RecruiteeProfile> {
  @Column
  public name: string;

  @Column(DataType.TEXT)
  public imageUrl: string;

  @Column(DataType.TEXT)
  public description: string;

  @BelongsTo(() => Account)
  public account: Account;

  @ForeignKey(() => Account)
  @Column
  public accountId: number;
}
