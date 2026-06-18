import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginRequestDto {
  @ApiProperty({ example: "familia@example.com" })
  @IsEmail()
  @MaxLength(180)
  email!: string;

  @ApiProperty({ example: "StrongPassword123!", minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string;
}
