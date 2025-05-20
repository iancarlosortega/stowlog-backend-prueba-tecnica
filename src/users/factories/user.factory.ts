import { Injectable } from '@nestjs/common';
import { UserRoles } from '@/auth/constants/roles';
import { User } from '@/users/entities/user.entity';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { generateUUID } from '@/shared/utils/uuid';

@Injectable()
export class UserFactory {
	createUser(overrides: Partial<User> = {}, createDto?: CreateUserDto): User {
		const now = new Date();

		const user = {
			id: generateUUID(),
			fullName: createDto?.fullName || 'Test User',
			username: createDto?.username || 'testuser',
			password: createDto?.password || 'password123',
			email: createDto?.email || 'test@example.com',
			role: UserRoles.USER,
			isActive: true,
			createdAt: now,
			updatedAt: now,
			...overrides,
		} as User;

		return user;
	}
	createAdmin(overrides: Partial<User> = {}): User {
		return this.createUser({
			role: UserRoles.ADMIN,
			...overrides,
		});
	}

	fromDto(dto: CreateUserDto, overrides: Partial<User> = {}): User {
		return this.createUser(overrides, dto);
	}

	createInactive(overrides: Partial<User> = {}): User {
		return this.createUser({
			isActive: false,
			...overrides,
		});
	}
}
