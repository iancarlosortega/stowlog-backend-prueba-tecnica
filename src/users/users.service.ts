import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { User } from '@/users/entities/user.entity';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { UserFactory } from '@/users/factories/user.factory';
import {
	USER_REPOSITORY,
	UserRepository,
} from '@/users/repositories/user.repository';

@Injectable()
export class UsersService {
	constructor(
		@Inject(USER_REPOSITORY)
		private readonly userRepository: UserRepository,
		private readonly userFactory: UserFactory,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const user = this.userFactory.fromDto(createUserDto);
		const newUser = await this.userRepository.create(user);
		return newUser;
	}

	async findOne(id: string): Promise<User | null> {
		const user = await this.userRepository.findById(id);
		if (!user) throw new NotFoundException(`User with id ${id} not found`);
		return user;
	}

	async findByUsername(username: string): Promise<User | null> {
		return this.userRepository.findByUsername(username);
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.userRepository.findByEmail(email);
	}
}
