import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateApplicationDto {
  @ApiProperty({ example: "Identity Web" })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: "identity" })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  code!: string;

  @ApiProperty({ example: "identity-web" })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  clientId!: string;

  @ApiPropertyOptional({ example: "secret-value" })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(120)
  clientSecret?: string;
}
