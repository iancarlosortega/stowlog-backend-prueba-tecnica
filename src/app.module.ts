import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from '@/config/app.config';
import { EnvSchema } from '@/config/validation';

import { EventEmitterModule } from '@nestjs/event-emitter';

import { AuthModule } from '@/auth/auth.module';
import { DatabaseModule } from '@/database/database.module';
import { HealthModule } from '@/health/health.module';
import { MailModule } from '@/mail/mail.module';
import { NotificationsModule } from '@/notifications/notifications.module';
import { TasksModule } from '@/tasks/tasks.module';
import { UsersModule } from '@/users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [EnvConfiguration],
			validationSchema: EnvSchema,
			isGlobal: true,
		}),
		EventEmitterModule.forRoot(),
		AuthModule,
		DatabaseModule,
		HealthModule,
		MailModule,
		NotificationsModule,
		TasksModule,
		UsersModule,
	],
})
export class AppModule {}
