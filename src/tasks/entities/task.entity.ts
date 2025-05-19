import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Task {
	@ApiProperty({
		description: 'Unique identifier for the task',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({
		description: 'Title of the task',
		example: 'Complete project documentation',
	})
	@Column('text')
	title: string;

	@ApiProperty({
		description: 'Detailed description of the task',
		example: 'Write comprehensive API documentation for all endpoints',
	})
	@Column('text')
	description: string;

	@ApiProperty({
		description: 'Whether the task has been completed',
		example: false,
		default: false,
	})
	@Column('bool', {
		default: false,
	})
	completed: boolean;

	@ApiProperty({
		description: 'Timestamp when the task was created',
		example: '2023-01-01T00:00:00.000Z',
	})
	@CreateDateColumn({ type: 'timestamp with time zone' })
	createdAt: Date;

	@ApiProperty({
		description: 'Timestamp when the task was last updated',
		example: '2023-01-02T00:00:00.000Z',
	})
	@UpdateDateColumn({ type: 'timestamp with time zone' })
	updatedAt: Date;
}
