import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from '@/config/app.config';
import { EnvSchema } from '@/config/validation';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

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
			port: +process.env.DB_PORT!,
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
		AuthModule,
		UsersModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
