import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { UserFactory } from '@/users/factories/user.factory';

import { USER_REPOSITORY } from '@/users/repositories/user.repository';
import { UserRepositoryTypeOrm } from '@/users/repositories/user.repository.typeorm';
import { UserRepositoryInMemory } from '@/users/repositories/user.repository.memory';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [
		UsersService,
		UserFactory,
		{
			provide: USER_REPOSITORY,
			useClass:
				process.env.ENVIRONMENT === 'TESTING'
					? UserRepositoryInMemory
					: UserRepositoryTypeOrm,
		},
	],
	exports: [UsersService],
})
export class UsersModule {}
