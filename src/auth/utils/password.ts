import * as bcrypt from 'bcrypt';
import { PASSWORD_SALT } from '@/auth/constants/settings';

export async function hashPassword(password: string): Promise<string> {
	const saltRounds = PASSWORD_SALT;
	return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
	plainTextPassword: string,
	hashedPassword: string,
): Promise<boolean> {
	return bcrypt.compare(plainTextPassword, hashedPassword);
}
