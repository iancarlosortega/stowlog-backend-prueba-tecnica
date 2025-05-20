import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from '@/mail/mail.service';

@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				transport: {
					host: config.get<string>('SMTP_HOST'),
					port: config.get<number>('SMTP_PORT'),
					secure: false,
					auth: {
						user: config.get<string>('SMTP_USER'),
						pass: config.get<string>('SMTP_PASS'),
					},
					tls: {
						rejectUnauthorized:
							config.get<string>('ENVIRONMENT') === 'DEVELOPMENT'
								? false
								: true,
					},
				},
				defaults: {
					from: config.get<string>('SMTP_FROM'),
				},
			}),
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
