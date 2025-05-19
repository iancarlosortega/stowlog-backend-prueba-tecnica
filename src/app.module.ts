import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/app.config';
import { EnvSchema } from './config/validation';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [EnvConfiguration],
			validationSchema: EnvSchema,
			isGlobal: true,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
