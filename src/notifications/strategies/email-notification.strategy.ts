import { Injectable } from '@nestjs/common';
import { NotificationStrategy } from './notification.strategy';

@Injectable()
export class EmailNotificationStrategy implements NotificationStrategy {
	async send(recipient: string, message: string): Promise<void> {
		// Aquí usarías tu MailService (por ejemplo con Nodemailer)
		console.log(`Enviando email a ${recipient}: ${message}`);
	}
}
