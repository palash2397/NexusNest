import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  question: string;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
  answer: string;
}
