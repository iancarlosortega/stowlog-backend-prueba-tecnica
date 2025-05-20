import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateTaskDto } from '@/tasks/dtos/create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
	@ApiProperty({
		description: 'Optional flag to mark a task as completed',
		example: true,
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	completed?: boolean;
}
