import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
	private logger = new Logger(MailService.name);

	constructor(private mailerService: MailerService) {}

	async sendMail(to: string, subject: string, content: string) {
		try {
			await this.mailerService.sendMail({
				to,
				subject,
				text: content,
				html: `<p>${content}</p>`,
			});
		} catch (error) {
			this.logger.error(`Failed to send email to ${to}: ${error.message}`);
			throw new Error(`Failed to send email: ${error.message}`);
		}
	}
}
