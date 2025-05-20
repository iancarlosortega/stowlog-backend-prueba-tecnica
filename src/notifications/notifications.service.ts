import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '@/notifications/entities/notification.entity';
import { CreateNotificationDto } from '@/notifications/dtos/create-notification.dto';

@Injectable()
export class NotificationsService {
	constructor(
		@InjectRepository(Notification)
		private notificationRepository: Repository<Notification>,
	) {}

	async create(notification: CreateNotificationDto): Promise<Notification> {
		try {
			const newNotification = this.notificationRepository.create(notification);
			return this.notificationRepository.save(newNotification);
		} catch (error) {
			throw new BadRequestException(
				`Failed to create notification: ${error.message}`,
			);
		}
	}
}
