import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { RecruiteeProfile } from './recruitee-profile.model';
import { Skill } from './skill.model';

@Table({ tableName: 'skills_recruitee_profiles' })
export class SkillRecruiteeProfile extends Model<SkillRecruiteeProfile> {
  @ForeignKey(() => RecruiteeProfile)
  @Column
  public recruiteeProfileId: number;

  @ForeignKey(() => Skill)
  @Column
  public skillId: number;
}
