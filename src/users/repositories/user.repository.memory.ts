import { Injectable } from '@nestjs/common';
import { User } from '@/users/entities/user.entity';
import { UserRepository } from '@/users/repositories/user.repository';

@Injectable()
export class UserRepositoryInMemory implements UserRepository {
	private users: User[] = [];

	async create(user: User): Promise<User> {
		this.users.push(user);
		return user;
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
