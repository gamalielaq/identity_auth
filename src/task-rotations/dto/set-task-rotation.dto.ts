import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class TaskRotationMemberDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  userId!: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  position!: number;
}

export class SetTaskRotationDto {
  @ApiProperty({
    type: [TaskRotationMemberDto],
    example: {
      members: [
        { userId: '550e8400-e29b-41d4-a716-446655440000', position: 1 },
        { userId: '7c9e6679-7425-40de-944b-e07fc1f90ae7', position: 2 },
      ],
    }.members,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TaskRotationMemberDto)
  members!: TaskRotationMemberDto[];
}
