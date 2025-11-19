import { IsString } from 'class-validator';

export class deleteFoundationDto {
  @IsString()
  id: string;
}
