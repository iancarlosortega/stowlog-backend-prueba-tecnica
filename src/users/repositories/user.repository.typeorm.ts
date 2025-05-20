import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { UserRepository } from '@/users/repositories/user.repository';

@Injectable()
export class UserRepositoryTypeOrm implements UserRepository {
	constructor(
		@InjectRepository(User)
		private readonly repository: Repository<User>,
	) {}

	async create(user: User): Promise<User> {
		const newUser = this.repository.create(user);
		return await this.repository.save(newUser);
	}

	async findById(id: string): Promise<User | null> {
		return await this.repository.findOneBy({ id });
	}

	async findByUsername(username: string): Promise<User | null> {
		return await this.repository.findOneBy({ username });
	}

	async findByEmail(email: string): Promise<User | null> {
		return await this.repository.findOneBy({ email });
	}
}
