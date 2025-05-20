import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { UserRepository } from '@/users/repositories/user.repository';
import { CreateUserDto } from '@/users/dtos/create-user.dto';

@Injectable()
export class UserRepositoryTypeOrm implements UserRepository {
	constructor(
		@InjectRepository(User)
		private readonly repository: Repository<User>,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const newUser = this.repository.create(createUserDto);
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
