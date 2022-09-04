export class LoginAccountDto {
  public emailAddress: string = '';
  public password: string = '';
  public platform: string = '';

  constructor(emailAddress: string, password: string, platform: string) {
    this.emailAddress = emailAddress;
    this.password = password;
    this.platform = platform;
  }

  public toJson(): {
    emailAddress: string;
    password: string;
    platform: string;
  } {
    return {
      emailAddress: this.emailAddress,
      password: this.password,
      platform: this.platform,
    };
  }

  static empty(): LoginAccountDto {
    return new LoginAccountDto('', '', '');
  }

  static fromJson(json: any): LoginAccountDto {
    return new LoginAccountDto(
      json.emailAddress ?? '',
      json.password ?? '',
      json.platform ?? ''
    );
  }
}

