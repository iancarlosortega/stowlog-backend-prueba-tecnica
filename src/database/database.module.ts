import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		ConfigModule,
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get<string>('DB_HOST'),
				port: configService.get<number>('DB_PORT', 5432),
				username: configService.get<string>('DB_USER'),
				password: configService.get<string>('DB_PASSWORD', ''),
				database: configService.get<string>('DB_NAME'),
				autoLoadEntities: true,
				synchronize: true,
				ssl: configService.get<string>('ENVIRONMENT') === 'PRODUCTION',
				extra:
					configService.get<string>('ENVIRONMENT') === 'PRODUCTION'
						? {
								ssl: {
									rejectUnauthorized: false,
								},
							}
						: undefined,
			}),
		}),
	],
	exports: [TypeOrmModule],
})
export class DatabaseModule {}
