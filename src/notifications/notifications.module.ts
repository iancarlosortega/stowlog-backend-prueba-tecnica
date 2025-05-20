import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '@/mail/mail.module';
import { Notification } from '@/notifications/entities/notification.entity';
import { NotificationsService } from '@/notifications/notifications.service';

import { EmailNotificationStrategy } from '@/notifications/strategies/email-notification.strategy';
import { InternalMessageNotificationStrategy } from '@/notifications/strategies/internal-message-notification.strategy';

@Module({
	imports: [TypeOrmModule.forFeature([Notification]), MailModule],
	providers: [
		EmailNotificationStrategy,
		InternalMessageNotificationStrategy,
		NotificationsService,
	],
	exports: [EmailNotificationStrategy, InternalMessageNotificationStrategy],
})
export class NotificationsModule {}
