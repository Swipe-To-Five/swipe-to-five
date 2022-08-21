import { RolesGuard } from './../../guards/roles.guard';
import { RECRUITER, RECRUITEE } from './../../constants/roles.constant';
import { Account } from './../../models/account.model';
import { JwtGuard } from './../../guards/jwt.guard';
import { CreateAccountDto } from './../../dto/auth/create-account.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import * as bcrypt from 'bcrypt';
import { AccountError } from '../../enum/account/account-error.enum';
import { LoggedInAccount } from './../../decorators/logged-in-account.decorator';
import { Roles } from './../../decorators/roles.decorator';

/**
 * Controller Layer Implementation for Account.
 */
@Controller('v1/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /**
   * Controller Implementation for account creation.
   * @param createAccountDto DTO Object for account creation.
   * @returns Account Model Object
   */
  @Post()
  public async createAccount(@Body() createAccountDto: CreateAccountDto) {
    // Check for account existence in the database.
    const checkAccount = await this.accountService.getAccount({
      where: {
        emailAddress: createAccountDto.emailAddress,
      },
    });

    if (checkAccount) {
      throw new BadRequestException({
        message: AccountError.ACCOUNT_ALREADY_EXISTS,
      });
    } else {
      // Hash the plaintext password.
      const hashedPassword = await bcrypt.hash(createAccountDto.password, 12);

      // Save the new account in the database and return the object.
      return await this.accountService.createAccount({
        emailAddress: createAccountDto.emailAddress,
        password: hashedPassword,
        role: createAccountDto.role,
      });
    }
  }

  /**
   * Controller Implementation for fetching logged in user details.
   * @param account Logged In User Details.
   * @returns Logged In User Details.
   */
  @Get()
  @Roles(RECRUITER, RECRUITEE)
  @UseGuards(JwtGuard, RolesGuard)
  public getAccount(@LoggedInAccount() account: Account): Account {
    return account;
  }
}
