import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
	const logger = new Logger('Bootstrap');

	const port = process.env.PORT;
	if (!port) {
		throw new Error('PORT is not defined');
	}

	const app = await NestFactory.create(AppModule);

	app.enableCors();
	app.setGlobalPrefix('api');
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle('Tasks API')
		.setDescription(
			'This API provides a simple task management system. You can create, update, delete, and retrieve tasks. Each endpoint is secured with JWT authentication and requires a valid token to access.',
		)
		.setVersion('1.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
			'access-token',
		)
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(port);
	logger.log(`Application is running on: ${port}`);
}
bootstrap();
