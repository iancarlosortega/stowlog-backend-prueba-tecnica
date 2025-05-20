import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
	imports: [
		ThrottlerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const environment = configService.get<string>('ENVIRONMENT');
				const isProduction = environment === 'PRODUCTION';
				return {
					throttlers: [
						{
							ttl: seconds(60),
							limit: 100,
						},
					],
					skipIf: () => !isProduction,
				};
			},
		}),
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class RateLimitModule {}
