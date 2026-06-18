import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterRequestDto {
  @ApiProperty({ example: "familia@example.com" })
  @IsEmail()
  @MaxLength(180)
  email!: string;

  @ApiProperty({ example: "StrongPassword123!", minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string;

  @ApiProperty({ example: "Familia García", minLength: 2, maxLength: 160 })
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  familyName!: string;

  @ApiProperty({ example: "Mamá", minLength: 2, maxLength: 120 })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  adminName!: string;

  @ApiProperty({ example: "1234", minLength: 4, maxLength: 4 })
  @Matches(/^\d{4}$/)
  adminPin!: string;
}
