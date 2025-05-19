import { IsString, MaxLength, MinLength } from 'class-validator';
import {
	PASSWORD_MAX_LENGTH,
	PASSWORD_MIN_LENGTH,
} from '@/auth/constants/validations';

export class LoginUserDto {
	@IsString()
	username: string;

	@IsString()
	@MinLength(PASSWORD_MIN_LENGTH)
	@MaxLength(PASSWORD_MAX_LENGTH)
	password: string;
}
