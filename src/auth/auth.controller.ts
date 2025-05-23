import { Body, Controller, Get, Post } from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { seconds, Throttle } from '@nestjs/throttler';
import { AuthService } from '@/auth/auth.service';
import { LoginResponseDto } from '@/auth/dtos/login-response.dto';
import { LoginUserDto } from '@/auth/dtos/login-user.dto';
import { RegisterUserDto } from '@/auth/dtos/register-user.dto';
import { Auth } from '@/auth/decorators/auth.decorator';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { UserRoles } from '@/auth/constants/roles';
import { User } from '@/users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@Throttle({ default: { ttl: seconds(60), limit: 5 } })
	@ApiOperation({ summary: 'Register a new user' })
	@ApiResponse({
		status: '2XX',
		description: 'User registered succesfully',
		type: LoginResponseDto,
	})
	@ApiResponse({ status: '4XX', description: 'Username already taken' })
	register(@Body() registerUserDto: RegisterUserDto) {
		return this.authService.register(registerUserDto);
	}

	@Post('login')
	@Throttle({ default: { ttl: seconds(60), limit: 5 } })
	@ApiOperation({ summary: 'Login a user' })
	@ApiResponse({
		status: '2XX',
		description: 'User logged in succesfully',
		type: LoginResponseDto,
	})
	@ApiResponse({ status: '4XX', description: 'Invalid credentials' })
	login(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto);
	}

	@Get('refresh-token')
	@Auth()
	@ApiOperation({ summary: 'Refresh the authentication token' })
	@ApiBearerAuth('access-token')
	@ApiResponse({
		status: '2XX',
		description: 'Token revalidated',
		type: LoginResponseDto,
	})
	@ApiResponse({ status: '4XX', description: 'Invalid token' })
	refreshToken(@GetUser() user: User) {
		return this.authService.refreshToken(user);
	}

	@Get('only-admin')
	@Auth(UserRoles.ADMIN)
	@ApiOperation({ summary: 'Only accessible for admin users' })
	@ApiBearerAuth('access-token')
	@ApiResponse({
		status: '2XX',
		description: 'You are an admin',
	})
	@ApiResponse({ status: '4XX', description: 'Invalid token or role' })
	onlyAdmin(@GetUser() user: User) {
		return `You are an admin: ${user.username} and your role is ${user.role}`;
	}
}
