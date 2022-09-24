import { Skill } from './../../models/skill.model';
import { RecruiterProfile } from './../../models/recruiter-profile.model';
import { RecruiteeProfile } from './../../models/recruitee-profile.model';
import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([RecruiteeProfile, RecruiterProfile, Skill]),
  ],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
