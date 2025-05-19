import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { LoginUserDto } from '@/auth/dtos/login-user.dto';
import { RegisterUserDto } from '@/auth/dtos/register-user.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	register(@Body() registerUserDto: RegisterUserDto) {
		return this.authService.register(registerUserDto);
	}

	@Post('login')
	login(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto);
	}
}
