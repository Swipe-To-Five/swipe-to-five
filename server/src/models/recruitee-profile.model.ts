import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Account } from './account.model';
import { SkillRecruiteeProfile } from './skill-recruitee-profile.model';
import { Skill } from './skill.model';

@Table({ tableName: 'recruitee_profiles' })
export class RecruiteeProfile extends Model<RecruiteeProfile> {
  @Column
  public name: string;

  @Column(DataType.TEXT)
  public imageUrl: string;

  @Column(DataType.TEXT)
  public resumeUrl: string;

  @Column(DataType.TEXT)
  public description: string;

  @BelongsToMany(
    () => Skill,
    () => SkillRecruiteeProfile,
    'recruiteeProfileId',
    'skillId',
  )
  public skills: Skill[];

  @BelongsTo(() => Account)
  public account: Account;

  @ForeignKey(() => Account)
  @Column
  public accountId: number;
}
