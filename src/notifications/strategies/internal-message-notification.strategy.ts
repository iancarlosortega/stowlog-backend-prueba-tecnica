import { Injectable } from '@nestjs/common';
import { NotificationStrategy } from '@/notifications/strategies/notification.strategy';
import { NotificationsService } from '@/notifications/notifications.service';

@Injectable()
export class InternalMessageNotificationStrategy
	implements NotificationStrategy
{
	constructor(private readonly notificationsService: NotificationsService) {}

	async send(recipient: string, message: string): Promise<void> {
		try {
			await this.notificationsService.create({
				userId: recipient,
				message,
			});
		} catch (error) {
			throw new Error(`Failed to send internal message: ${error.message}`);
		}
	}
}
