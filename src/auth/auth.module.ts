import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { UsersModule } from '@/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JWT_EXPIRATION_TIME } from '@/auth/constants/settings';

@Module({
	imports: [
		PassportModule.register({
			defaultStrategy: 'jwt',
		}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: {
					expiresIn: JWT_EXPIRATION_TIME,
				},
			}),
		}),
		UsersModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	exports: [JwtStrategy, JwtModule, PassportModule],
})
export class AuthModule {}
