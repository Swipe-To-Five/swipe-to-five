import { RECRUITEE, RECRUITER } from './../constants/roles.constant';
import { AccessToken } from './access_token.model';
import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { RecruiteeProfile } from './recruitee-profile.model';
import { RecruiterProfile } from './recruiter-profile.model';

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

  @HasOne(() => RecruiteeProfile)
  public recruiteeProfile: RecruiteeProfile;

  @HasOne(() => RecruiterProfile)
  public recruiterProfile: RecruiterProfile;
}
