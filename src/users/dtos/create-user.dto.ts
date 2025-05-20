import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import {
	PASSWORD_MAX_LENGTH,
	PASSWORD_MIN_LENGTH,
} from '@/auth/constants/validations';

export class CreateUserDto {
	@ApiProperty({
		description: 'Full name of the user',
		example: 'Ian Carlos Ortega',
		minLength: 3,
		maxLength: 50,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(50)
	fullName: string;

	@ApiProperty({
		description: 'Username for account login',
		example: 'johndoe',
		minLength: 4,
		maxLength: 30,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(4)
	@MaxLength(30)
	username: string;

	@ApiProperty({
		description: 'User password',
		example: 'StrongP@ss123',
		minLength: PASSWORD_MIN_LENGTH,
		maxLength: PASSWORD_MAX_LENGTH,
		format: 'password',
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(PASSWORD_MIN_LENGTH)
	@MaxLength(PASSWORD_MAX_LENGTH)
	password: string;
}
