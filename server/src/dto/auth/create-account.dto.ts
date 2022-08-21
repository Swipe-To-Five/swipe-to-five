import { RECRUITEE, RECRUITER } from './../../constants/roles.constant';
import { IsNotEmpty, IsEmail, IsIn } from 'class-validator';

export class CreateAccountDto {
  @IsEmail()
  @IsNotEmpty()
  public emailAddress: string;

  @IsNotEmpty()
  public password: string;

  @IsNotEmpty()
  @IsIn([RECRUITEE, RECRUITER])
  public role: string;
}
