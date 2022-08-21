import { Account } from './../../models/account.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Global, Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([Account])],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
