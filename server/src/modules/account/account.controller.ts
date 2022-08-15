import { CreateAccountDto } from './../../dto/auth/create-account.dto';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import * as bcrypt from 'bcrypt';
import { AccountError } from '../../enum/account/account-error.constant';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  public async createAccount(@Body() createAccountDto: CreateAccountDto) {
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
      const hashedPassword = await bcrypt.hash(createAccountDto.password, 12);
      return await this.accountService.createAccount({
        emailAddress: createAccountDto.emailAddress,
        password: hashedPassword,
      });
    }
  }
}
