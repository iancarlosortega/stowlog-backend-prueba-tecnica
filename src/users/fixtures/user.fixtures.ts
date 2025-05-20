import { CreateUserDto } from '@/users/dtos/create-user.dto';

export const userFixtures = {
	createUserDto: {
		fullName: 'Ian Carlos Ortega',
		username: 'iancarlosortega',
		password: 'password123',
		email: 'iancarlosortegaleon@gmail.com',
	} as CreateUserDto,
	createAdminDto: {
		fullName: 'Admin User',
		username: 'admin',
		password: 'admin123',
		email: 'admin@example.com',
	} as CreateUserDto,
	invalidUserDto: {
		fullName: '',
		username: '',
		password: '',
		email: 'invalid-email',
	} as CreateUserDto,
};
