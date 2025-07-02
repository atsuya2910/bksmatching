import { IsString, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDateString()
  @IsNotEmpty()
  eventDate: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tagIds?: number[];
}
