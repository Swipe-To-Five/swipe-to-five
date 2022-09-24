import { RecruiterProfile } from './../../models/recruiter-profile.model';
import { UpdateRecruiterProfile } from './../../dto/profile/update-recruiter-profile.dto';
import { Account } from './../../models/account.model';
import { UpdateRecruiteeProfile } from './../../dto/profile/update-recruitee-profile.dto';
import { ProfileService } from './profile.service';
import { RecruiteeProfile } from './../../models/recruitee-profile.model';
import { RolesGuard } from './../../guards/roles.guard';
import { RECRUITER, RECRUITEE } from './../../constants/roles.constant';
import { JwtGuard } from './../../guards/jwt.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../../decorators/roles.decorator';
import { LoggedInAccount } from '../../decorators/logged-in-account.decorator';

@Controller('v1/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Controller Implementation for updating recruitee profile.
   * @param account Logged In Account
   * @param updateRecruiteeProfile DTO Implementation for updating recruitee profile.
   * @returns Upserted recruitee profile.
   */
  @Post('recruitee')
  @Roles(RECRUITEE)
  @UseGuards(JwtGuard, RolesGuard)
  public async updateRecruiteeProfile(
    @LoggedInAccount() account: Account,
    @Body() updateRecruiteeProfile: UpdateRecruiteeProfile,
  ): Promise<RecruiteeProfile> {
    return await this.profileService.upsertRecruiteeProfile(
      account,
      updateRecruiteeProfile,
    );
  }

  /**
   * Controller Implementation for updating recruiter profile.
   * @param account Logged In Account
   * @param updateRecruiteeProfile DTO Implementation for updating recruiter profile.
   * @returns Upserted recruiter profile.
   */
  @Post('recruiter')
  @Roles(RECRUITER)
  @UseGuards(JwtGuard, RolesGuard)
  public async updateRecruiterProfile(
    @LoggedInAccount() account: Account,
    @Body() updateRecruiterProfile: UpdateRecruiterProfile,
  ): Promise<RecruiterProfile> {
    return await this.profileService.upsertRecruiterProfile(
      account,
      updateRecruiterProfile,
    );
  }
}
