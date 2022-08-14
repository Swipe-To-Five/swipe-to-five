import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateAccountDto {
  @IsEmail()
  @IsNotEmpty()
  public emailAddress: string;

  @IsNotEmpty()
  public password: string;
}
