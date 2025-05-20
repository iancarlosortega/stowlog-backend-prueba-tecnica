import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
	@ApiProperty({
		description: 'The title of the task',
		example: 'Complete project documentation',
	})
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({
		description: 'Optional description of the task',
		example: 'Write comprehensive API documentation for all endpoints',
		required: false,
	})
	@IsString()
	@IsOptional()
	description?: string;
}
