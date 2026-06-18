import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateMemberDto {
  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  @IsUUID()
  familyId!: string;

  @ApiProperty({ example: "Ana", minLength: 2, maxLength: 120 })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;
}
