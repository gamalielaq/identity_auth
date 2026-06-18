import { ApiProperty } from "@nestjs/swagger";

export class ApplicationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  clientId!: string;

  @ApiProperty()
  status!: string;
}
