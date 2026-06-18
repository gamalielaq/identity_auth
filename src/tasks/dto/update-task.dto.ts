import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DayOfWeek } from '../../common/enums/day-of-week.enum';
import { TaskRecurrenceType } from '../../common/enums/task-recurrence-type.enum';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    example: 'Limpiar cocina',
    minLength: 2,
    maxLength: 160,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title?: string;

  @ApiPropertyOptional({
    example: 'Limpiar mesada, cocina y piso',
    maxLength: 1000,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string | null;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @ApiPropertyOptional({
    enum: TaskRecurrenceType,
    example: TaskRecurrenceType.WEEKLY,
  })
  @IsOptional()
  @IsEnum(TaskRecurrenceType)
  recurrenceType?: TaskRecurrenceType;

  @ApiPropertyOptional({
    enum: DayOfWeek,
    example: DayOfWeek.SATURDAY,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek | null;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
