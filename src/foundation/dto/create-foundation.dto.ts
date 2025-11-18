import { IsString, MinLength} from 'class-validator';

export class CreateFoundationDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  description: string;

  @IsString()
  website: string;
}
// name, description, website
