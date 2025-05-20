import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from '@/config/app.config';
import { EnvSchema } from '@/config/validation';

import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AuthModule } from '@/auth/auth.module';
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
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
			database: process.env.DB_NAME,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			autoLoadEntities: true,
			synchronize: true,
			ssl: process.env.ENVIRONMENT === 'PRODUCTION',
			extra: {
				ssl:
					process.env.ENVIRONMENT === 'PRODUCTION'
						? {
								rejectUnauthorized: false,
							}
						: null,
			},
		}),
		EventEmitterModule.forRoot(),
		AuthModule,
		HealthModule,
		MailModule,
		NotificationsModule,
		TasksModule,
		UsersModule,
	],
})
export class AppModule {}
