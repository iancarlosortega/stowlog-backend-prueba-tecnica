import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@/auth/auth.service';
import { LoginResponseDto } from '@/auth/dtos/login-response.dto';
import { LoginUserDto } from '@/auth/dtos/login-user.dto';
import { RegisterUserDto } from '@/auth/dtos/register-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
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
	@ApiResponse({
		status: '2XX',
		description: 'User logged in succesfully',
		type: LoginResponseDto,
	})
	@ApiResponse({ status: '4XX', description: 'Invalid credentials' })
	login(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto);
	}
}
