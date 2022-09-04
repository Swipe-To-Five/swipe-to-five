import { RECRUITEE } from './../../constants/roles.constants';

export class CreateAccountDto {
  public emailAddress: string = '';
  public password: string = '';
  public role: string = RECRUITEE;

  constructor(emailAddress: string, password: string, role: string) {
    this.emailAddress = emailAddress;
    this.password = password;
    this.role = role;
  }

  static empty(): CreateAccountDto {
    return new CreateAccountDto('', '', '');
  }

  static fromJson(json: any): CreateAccountDto {
    return new CreateAccountDto(
      json.emailAddress ?? '',
      json.password ?? '',
      json.role ?? ''
    );
  }

  public toJson(): { emailAddress: string; password: string; role: string } {
    return {
      emailAddress: this.emailAddress,
      password: this.password,
      role: this.role,
    };
  }
}

