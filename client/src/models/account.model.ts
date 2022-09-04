export class Account {
  public id: number = 0;
  public emailAddress: string = '';
  public role: string = '';

  constructor(id: number, emailAddress: string, role: string) {
    this.id = id;
    this.emailAddress = emailAddress;
    this.role = role;
  }

  static empty(): Account {
    return new Account(0, '', '');
  }

  static fromJson(json: any): Account {
    return new Account(
      json.id ? Number(json.id) : 0,
      json.emailAddress ?? '',
      json.role ?? ''
    );
  }

  public toJson(): { id: number; emailAddress: string; role: string } {
    return {
      id: this.id,
      emailAddress: this.emailAddress,
      role: this.role,
    };
  }
}

