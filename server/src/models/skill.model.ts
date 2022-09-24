import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { RecruiteeProfile } from './recruitee-profile.model';
import { SkillRecruiteeProfile } from './skill-recruitee-profile.model';

@Table({ tableName: 'skills' })
export class Skill extends Model<Skill> {
  @Column
  public skill: string;

  @BelongsToMany(
    () => RecruiteeProfile,
    () => SkillRecruiteeProfile,
    'skillId',
    'recruiteeProfileId',
  )
  recruiteeProfiles: RecruiteeProfile[];
}
