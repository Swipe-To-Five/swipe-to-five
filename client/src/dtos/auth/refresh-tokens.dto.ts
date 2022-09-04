export class RefreshTokensDto {
  public refreshToken: string = '';

  constructor(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  public toJson(): {
    refreshToken: string;
  } {
    return {
      refreshToken: this.refreshToken,
    };
  }

  static empty(): RefreshTokensDto {
    return new RefreshTokensDto('');
  }

  static fromJson(json: any): RefreshTokensDto {
    return new RefreshTokensDto(json.refreshToken ?? '');
  }
}

