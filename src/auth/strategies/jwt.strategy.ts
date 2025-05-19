import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly usersService: UsersService,
		configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get('JWT_SECRET')!,
		});
	}

	async validate(payload: JwtPayload): Promise<Omit<User, 'password'>> {
		const { id } = payload;
		const user = await this.usersService.findOne(id);

		if (!user || !user.isActive) {
			throw new UnauthorizedException('Token is not valid');
		}

		const { password, ...userData } = user;
		return userData;
	}
}
