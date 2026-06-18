import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";
import { DayOfWeek } from "../../common/enums/day-of-week.enum";
import { TaskRecurrenceType } from "../../common/enums/task-recurrence-type.enum";

export class CreateTaskDto {
  @ApiProperty({ example: "Limpiar cocina", minLength: 2, maxLength: 160 })
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title!: string;

  @ApiPropertyOptional({
    example: "Limpiar mesada, cocina y piso",
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: "550e8400-e29b-41d4-a716-446655440000" })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    enum: TaskRecurrenceType,
    example: TaskRecurrenceType.WEEKLY,
  })
  @IsOptional()
  @IsEnum(TaskRecurrenceType)
  recurrenceType?: TaskRecurrenceType;

  @ApiPropertyOptional({ enum: DayOfWeek, example: DayOfWeek.SATURDAY })
  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;
}
