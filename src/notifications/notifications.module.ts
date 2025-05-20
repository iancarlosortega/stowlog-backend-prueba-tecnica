import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '@/notifications/entities/notification.entity';
import { NotificationsService } from '@/notifications/notifications.service';

@Module({
	imports: [TypeOrmModule.forFeature([Notification])],
	providers: [NotificationsService],
})
export class NotificationsModule {}
