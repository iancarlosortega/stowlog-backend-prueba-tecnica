import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { User } from '@/users/entities/user.entity';
import { CreateUserDto } from '@/users/dtos/create-user.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		this.userRepository.create(createUserDto);
		const user = await this.userRepository.save(createUserDto);
		return user;
	}

	async findOne(id: string): Promise<User | null> {
		return this.userRepository.findOneBy({ id });
	}

	async findByUsername(username: string): Promise<User | null> {
		return this.userRepository.findOneBy({ username });
	}
}
