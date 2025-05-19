import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { LoginUserDto } from '@/auth/dtos/login-user.dto';
import { RegisterUserDto } from '@/auth/dtos/register-user.dto';
import { hashPassword, verifyPassword } from '@/auth/utils/password';
import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
	private logger = new Logger(AuthService.name);

	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async register(registerUserDto: RegisterUserDto) {
		try {
			const { password, ...userData } = registerUserDto;

			const userExists = await this.usersService.findByUsername(
				userData.username,
			);

			if (userExists) {
				throw new BadRequestException(
					`User with username ${userData.username} already exists`,
				);
			}

			const passwordHashed = await hashPassword(password);
			const newUser = await this.usersService.create({
				...userData,
				password: passwordHashed,
			});

			const { password: _, ...user } = newUser;

			return {
				user,
				token: this.getJwtToken({
					id: newUser.id,
				}),
			};
		} catch (error) {
			this.handleDBExceptions(error);
		}
	}

	async login(loginUserDto: LoginUserDto) {
		try {
			const { password, username } = loginUserDto;

			const user = await this.usersService.findByUsername(username);

			if (!user) {
				throw new NotFoundException(`User with username ${username} not found`);
			}

			if (!user.isActive) {
				throw new BadRequestException(
					`User with username ${username} is inactive. Please contact support.`,
				);
			}

			const isPasswordValid = await verifyPassword(password, user.password);

			if (!isPasswordValid) {
				throw new BadRequestException('Invalid credentials');
			}

			const { password: _, ...rest } = user;

			return {
				user: rest,
				token: this.getJwtToken({
					id: user.id,
				}),
			};
		} catch (error) {
			this.handleDBExceptions(error);
		}
	}

	private getJwtToken(payload: JwtPayload) {
		return this.jwtService.sign(payload);
	}

	private handleDBExceptions(error: any): never {
		this.logger.error(error);
		if (error.status === 400) {
			throw new BadRequestException(error.response.message);
		}
		if (error.status === 404) {
			throw new NotFoundException(error.response.message);
		}
		if (error.code === '23505') {
			throw new BadRequestException(error.detail);
		}
		console.log(error);
		throw new InternalServerErrorException(
			'Unexpected error, check server logs',
		);
	}
}
