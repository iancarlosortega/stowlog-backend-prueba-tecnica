import { User } from '@/users/entities/user.entity';
import { CreateUserDto } from '@/users/dtos/create-user.dto';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
	create(createUserDto: CreateUserDto): Promise<User>;
	findById(id: string): Promise<User | null>;
	findByUsername(username: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
}
