import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import {
	PASSWORD_MAX_LENGTH,
	PASSWORD_MIN_LENGTH,
} from '@/auth/constants/validations';

export class LoginUserDto {
	@ApiProperty({
		example: 'iancarlosortega',
		description: 'Must be unique',
	})
	@IsString()
	username: string;

	@ApiProperty({
		example: '$Asdf123',
		description: 'Should be very secure',
		minLength: PASSWORD_MIN_LENGTH,
		maxLength: PASSWORD_MAX_LENGTH,
	})
	@IsString()
	@MinLength(PASSWORD_MIN_LENGTH)
	@MaxLength(PASSWORD_MAX_LENGTH)
	password: string;
}
