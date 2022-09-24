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
}
