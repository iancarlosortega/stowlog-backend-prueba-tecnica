import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { USER_REPOSITORY } from '@/users/repositories/user.repository';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { generateUUID } from '@/shared/utils/uuid';
import { UserFactory } from './factories/user.factory';
import { userFixtures } from './fixtures/user.fixtures';
import { UserRoles } from '@/auth/constants/roles';

describe('UsersService', () => {
	let service: UsersService;
	let userFactory: UserFactory;
	let mockUserRepository: {
		create: jest.Mock;
		findById: jest.Mock;
		findByUsername: jest.Mock;
		findByEmail: jest.Mock;
	};

	beforeEach(async () => {
		mockUserRepository = {
			create: jest.fn(),
			findById: jest.fn(),
			findByUsername: jest.fn(),
			findByEmail: jest.fn(),
		};
		userFactory = new UserFactory();
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: USER_REPOSITORY,
					useValue: mockUserRepository,
				},
				UserFactory,
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
	describe('create', () => {
		it('should create a new user', async () => {
			const createUserDto: CreateUserDto = userFixtures.createUserDto;

			const expectedUser = userFactory.fromDto(createUserDto);

			mockUserRepository.create.mockResolvedValue(expectedUser);

			const result = await service.create(createUserDto);

			expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
			expect(result).toEqual(expectedUser);
		});

		it('should create an admin user', async () => {
			const adminUser = userFactory.createAdmin();

			const adminDto: CreateUserDto = {
				fullName: adminUser.fullName,
				username: adminUser.username,
				password: adminUser.password,
				email: adminUser.email,
			};

			mockUserRepository.create.mockResolvedValue(adminUser);

			const result = await service.create(adminDto);

			expect(mockUserRepository.create).toHaveBeenCalledWith(adminDto);
			expect(result).toEqual(adminUser);
			expect(result.role).toEqual(UserRoles.ADMIN);
		});

		it('should create an inactive user', async () => {
			const inactiveUser = userFactory.createInactive();

			const inactiveDto: CreateUserDto = {
				fullName: inactiveUser.fullName,
				username: inactiveUser.username,
				password: inactiveUser.password,
				email: inactiveUser.email,
			};

			mockUserRepository.create.mockResolvedValue(inactiveUser);

			const result = await service.create(inactiveDto);

			expect(mockUserRepository.create).toHaveBeenCalledWith(inactiveDto);
			expect(result).toEqual(inactiveUser);
			expect(result.isActive).toBe(false);
		});
	});
	describe('findOne', () => {
		it('should return a user if found', async () => {
			const userId = generateUUID();
			const expectedUser = userFactory.createUser({ id: userId });

			mockUserRepository.findById.mockResolvedValue(expectedUser);

			const result = await service.findOne(userId);

			expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
			expect(result).toEqual(expectedUser);
		});

		it('should throw NotFoundException if user not found', async () => {
			const userId = 'non-existent-id';
			mockUserRepository.findById.mockResolvedValue(null);

			await expect(service.findOne(userId)).rejects.toThrow(
				new NotFoundException(`User with id ${userId} not found`),
			);
			expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
		});
	});
	describe('findByUsername', () => {
		it('should return a user if found by username', async () => {
			const username = 'iancarlosortega';
			const expectedUser = userFactory.createUser({ username });

			mockUserRepository.findByUsername.mockResolvedValue(expectedUser);

			const result = await service.findByUsername(username);

			expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(username);
			expect(result).toEqual(expectedUser);
		});

		it('should return null if user not found by username', async () => {
			const username = 'nonexistent';
			mockUserRepository.findByUsername.mockResolvedValue(null);

			const result = await service.findByUsername(username);

			expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(username);
			expect(result).toBeNull();
		});
	});
	describe('findByEmail', () => {
		it('should return a user if found by email', async () => {
			const email = 'iancarlosortegaleon@gmail.com';
			const expectedUser = userFactory.createUser({ email });

			mockUserRepository.findByEmail.mockResolvedValue(expectedUser);

			const result = await service.findByEmail(email);

			expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
			expect(result).toEqual(expectedUser);
		});

		it('should return null if user not found by email', async () => {
			const email = 'user-no-existent@example.com';
			mockUserRepository.findByEmail.mockResolvedValue(null);

			const result = await service.findByEmail(email);

			expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
			expect(result).toBeNull();
		});
	});
});
