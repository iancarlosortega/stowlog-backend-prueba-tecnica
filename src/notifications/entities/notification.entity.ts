import { ApiProperty } from '@nestjs/swagger';
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { AlertType } from '@/notifications/constants/notification-alerts-types';

@Entity()
export class Notification {
	@ApiProperty({
		description: 'Unique identifier for the notification',
		example: '123e4567-e89b-12d3-a456-426614174000',
	})
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({
		description: 'Content of the notification',
		example: 'You have a new task assigned',
	})
	@Column('text')
	message: string;

	@ApiProperty({
		description: 'Type of notification',
		example: AlertType.INFO,
		enum: AlertType,
	})
	@Column({
		type: 'enum',
		enum: AlertType,
		default: AlertType.INFO,
	})
	type: AlertType;

	@ApiProperty({
		description: 'Whether the notification has been read',
		example: false,
	})
	@Column({ default: false })
	isRead: boolean;

	@ApiProperty({
		description: 'ID of the user who received the notification',
		example: '7ab55156-76cc-410a-a921-e473c53604a0',
	})
	@Column('uuid')
	userId: string;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user: User;

	@ApiProperty({
		description: 'Timestamp when the notification was created',
		example: '2023-01-01T00:00:00Z',
	})
	@CreateDateColumn({
		type: 'timestamp with time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: Date;

	@ApiProperty({
		description: 'Timestamp when the notification was last updated',
		example: '2023-01-01T00:00:00Z',
	})
	@UpdateDateColumn({
		type: 'timestamp with time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	updatedAt: Date;
}
