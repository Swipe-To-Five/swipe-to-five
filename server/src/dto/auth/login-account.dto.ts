import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginAccountDto {
  @IsEmail()
  @IsNotEmpty()
  public emailAddress: string;

  @IsNotEmpty()
  public password: string;

  @IsNotEmpty()
  public platform: string;
}
