import { JwtStrategy } from './jwt.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
