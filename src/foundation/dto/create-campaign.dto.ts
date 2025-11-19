import {
  IsString,
  MinLength,
  MaxLength,
  IsArray,
  ArrayNotEmpty,
  IsMongoId,
} from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @IsMongoId()
  foundationId: string;

  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
  description: string;

  @IsString()
  eventDate: string;

  @IsString()
  location: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  participants: string[];
}
