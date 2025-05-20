import { Injectable } from '@nestjs/common';
import { User } from '@/users/entities/user.entity';
import { UserRepository } from '@/users/repositories/user.repository';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { generateUUID } from '@/shared/utils/uuid';

@Injectable()
export class UserRepositoryInMemory implements UserRepository {
	private users: User[] = [];

	async create(createUserDto: CreateUserDto): Promise<User> {
		const newUser: User = {
			id: generateUUID(),
			...createUserDto,
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		} as User;

		this.users.push(newUser);
		return newUser;
	}

	async findById(id: string): Promise<User | null> {
		return this.users.find((user) => user.id === id) || null;
	}

	async findByUsername(username: string): Promise<User | null> {
		return this.users.find((user) => user.username === username) || null;
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.users.find((user) => user.email === email) || null;
	}
}
