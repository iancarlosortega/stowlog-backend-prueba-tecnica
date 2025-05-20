import { Injectable } from '@nestjs/common';
import { NotificationStrategy } from '@/notifications/strategies/notification.strategy';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class EmailNotificationStrategy implements NotificationStrategy {
	constructor(private readonly mailService: MailService) {}

	async send(recipient: string, message: string): Promise<void> {
		console.log('Sending email notification...');
		await this.mailService.sendMail(
			recipient,
			'Notification from Tasks API',
			message,
		);
	}
}
