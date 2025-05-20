import { ApiProperty } from '@nestjs/swagger';
import {
	IsEnum,
	IsNotEmpty,
	IsString,
	IsUUID,
	MaxLength,
	MinLength,
} from 'class-validator';
import { NotificationType } from '@/notifications/constants/notification-types';

export class CreateNotificationDto {
	@ApiProperty({
		description: 'The ID of the user to whom the notification is sent',
		example: '1234567890abcdef12345678',
	})
	@IsUUID()
	@IsNotEmpty()
	userId: string;

	@ApiProperty({
		description: 'The content of the notification',
		example: 'You have a new task!',
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(255)
	message: string;
	@ApiProperty({
		description: 'The type of the notification',
		example: NotificationType.INFO,
		enum: NotificationType,
		default: NotificationType.INFO,
		required: false,
	})
	@IsEnum(NotificationType, {
		message: `Type must be one of the following: ${Object.values(NotificationType).join(', ')}`,
	})
	@IsNotEmpty()
	type?: NotificationType;
}
