import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateRecruiterProfile {
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  @IsUrl()
  public imageUrl: string;

  @IsNotEmpty()
  public description: string;
}
