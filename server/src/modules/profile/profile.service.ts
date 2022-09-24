import { UpdateRecruiteeProfile } from './../../dto/profile/update-recruitee-profile.dto';
import { Account } from './../../models/account.model';
import { Skill } from './../../models/skill.model';
import { RecruiterProfile } from './../../models/recruiter-profile.model';
import { RecruiteeProfile } from './../../models/recruitee-profile.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(RecruiteeProfile)
    private readonly recruiteeProfileRepository: typeof RecruiteeProfile,

    @InjectModel(RecruiterProfile)
    private readonly recruiterProfileRepository: typeof RecruiterProfile,

    @InjectModel(Skill)
    private readonly skillRepository: typeof Skill,
  ) {}

  /**
   * Service Implementation for updating recruitee profile.
   * @param account Logged in account details
   * @param updateRecruiteeProfile DTO Implementation for updating recruitee profile.
   * @returns Upserted Recruitee Profile
   */
  public async upsertRecruiteeProfile(
    account: Account,
    updateRecruiteeProfile: UpdateRecruiteeProfile,
  ): Promise<RecruiteeProfile> {
    // Finding or creating new skills in the database.
    const dbSkills = await Promise.all(
      updateRecruiteeProfile.skills.map(async (skill) => {
        const [dbSkill, created] = await this.skillRepository.findOrCreate({
          where: {
            skill: skill.toUpperCase(),
          },
        });

        if (created) return dbSkill;
      }),
    );

    // Checking if profile already exists.
    const dbProfile = await this.recruiteeProfileRepository.findOne({
      where: {
        accountId: account.id,
      },
    });

    // If profile already exists, update it.
    if (dbProfile)
      await this.recruiteeProfileRepository.update(
        {
          ...updateRecruiteeProfile,
          skills: dbSkills,
        },
        { where: { id: dbProfile.id } },
      );
    // Else, create a new one.
    else
      await this.recruiteeProfileRepository.create({
        accountId: account.id,
        account: account,
        ...updateRecruiteeProfile,
        skills: dbSkills,
      });

    // Return the upserted profile.
    return await this.recruiteeProfileRepository.findOne({
      where: {
        accountId: account.id,
      },
    });
  }
}
