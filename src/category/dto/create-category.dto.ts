import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(64)
  name: string;
  @IsString()
  @IsNotEmpty()
  photo: string;
}
