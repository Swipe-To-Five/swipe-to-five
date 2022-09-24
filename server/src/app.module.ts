import { TokensModule } from './modules/tokens/tokens.module';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessToken } from './models/access_token.model';
import { Account } from './models/account.model';
import { RefreshToken } from './models/refresh_token.model';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { SkillRecruiteeProfile } from './models/skill-recruitee-profile.model';
import { Skill } from './models/skill.model';
import { RecruiteeProfile } from './models/recruitee-profile.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      models: [
        Account,
        AccessToken,
        RefreshToken,
        RecruiteeProfile,
        Skill,
        SkillRecruiteeProfile,
      ],
      synchronize: true,
      autoLoadModels: true,
    }),
    AccountModule,
    TokensModule,
    AuthModule,
  ],
})
export class AppModule {}
