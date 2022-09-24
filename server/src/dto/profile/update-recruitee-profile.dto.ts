import { ArrayMinSize, IsNotEmpty, IsUrl, MinLength } from 'class-validator';

export class UpdateRecruiteeProfile {
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  @IsUrl()
  public imageUrl: string;

  @IsNotEmpty()
  @IsUrl()
  public resumeUrl: string;

  @IsNotEmpty()
  public description: string;

  @ArrayMinSize(0)
  @MinLength(2, { each: true })
  public skills: string[];
}
