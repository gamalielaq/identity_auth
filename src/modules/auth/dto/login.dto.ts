import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "ada@example.com" })
  @IsEmail()
  @MaxLength(180)
  email!: string;

  @ApiProperty({ example: "StrongPassword123!" })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string;

  @ApiProperty({ example: "identity-web" })
  @IsString()
  @MaxLength(120)
  clientId!: string;
}
