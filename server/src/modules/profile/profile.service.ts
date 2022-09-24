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
        return dbSkill;
      }),
    );

    // Checking if profile already exists.
    const dbProfile = await this.recruiteeProfileRepository.findOne({
      where: {
        accountId: account.id,
      },
    });

    // If profile already exists, update it.
    if (dbProfile) {
      const [_, [updatedProfile]] =
        await this.recruiteeProfileRepository.update(
          {
            name: updateRecruiteeProfile.name,
            description: updateRecruiteeProfile.description,
            imageUrl: updateRecruiteeProfile.imageUrl,
            resumeUrl: updateRecruiteeProfile.resumeUrl,
            skills: dbSkills,
          },
          { where: { id: dbProfile.id }, returning: true },
        );

      // Update skill relations on the profile.
      await updatedProfile.$set('skills', dbSkills, {
        through: 'skills_recruitee_profiles',
      });
    }
    // Else, create a new one.
    else {
      const newProfile = await this.recruiteeProfileRepository.create({
        accountId: account.id,
        account: account,
        name: updateRecruiteeProfile.name,
        description: updateRecruiteeProfile.description,
        imageUrl: updateRecruiteeProfile.imageUrl,
        resumeUrl: updateRecruiteeProfile.resumeUrl,
      });

      // Update skill relations on the profile.
      await newProfile.$set('skills', dbSkills, {
        through: 'skills_recruitee_profiles',
      });
    }

    // Return the upserted profile.
    return await this.recruiteeProfileRepository.findOne({
      where: {
        accountId: account.id,
      },
      include: [this.skillRepository],
    });
  }
}
