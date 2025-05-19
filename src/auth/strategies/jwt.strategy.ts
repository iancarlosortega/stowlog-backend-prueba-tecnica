import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get('JWT_SECRET')!,
		});
	}

	async validate(payload: JwtPayload): Promise<User> {
		const { id } = payload;
		const user = await this.userRepository.findOneBy({ id });

		console.log({ user });

		if (!user || !user.isActive) {
			throw new UnauthorizedException('Token is not valid');
		}

		return user;
	}
}
