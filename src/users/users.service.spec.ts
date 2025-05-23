import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { USER_REPOSITORY } from '@/users/repositories/user.repository';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { UserFactory } from '@/users/factories/user.factory';
import { userFixtures } from '@/users/fixtures/user.fixtures';
import { UserRoles } from '@/auth/constants/roles';
import { generateUUID } from '@/shared/utils/uuid';

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

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: UserFactory,
					useClass: UserFactory,
				},
				{
					provide: USER_REPOSITORY,
					useValue: mockUserRepository,
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
		userFactory = module.get<UserFactory>(UserFactory);
		jest.spyOn(userFactory, 'fromDto');
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
	describe('create', () => {
		it('should create a new user', async () => {
			const createUserDto: CreateUserDto = userFixtures.createUserDto;

			const userFromDto = userFactory.fromDto(createUserDto);
			jest.spyOn(userFactory, 'fromDto').mockReturnValue(userFromDto);

			mockUserRepository.create.mockResolvedValue(userFromDto);

			const result = await service.create(createUserDto);

			expect(userFactory.fromDto).toHaveBeenCalledWith(createUserDto);
			expect(mockUserRepository.create).toHaveBeenCalledWith(userFromDto);
			expect(result).toEqual(userFromDto);
		});
		it('should create an admin user', async () => {
			const adminDto: CreateUserDto = userFixtures.createAdminDto;
			const adminUser = userFactory.createAdmin(adminDto);

			jest.spyOn(userFactory, 'fromDto').mockReturnValue(adminUser);

			mockUserRepository.create.mockResolvedValue(adminUser);

			const result = await service.create(adminDto);

			expect(userFactory.fromDto).toHaveBeenCalledWith(adminDto);
			expect(mockUserRepository.create).toHaveBeenCalledWith(adminUser);
			expect(result).toEqual(adminUser);
			expect(result.role).toEqual(UserRoles.ADMIN);
		});
		it('should create an inactive user', async () => {
			const inactiveDto: CreateUserDto = userFixtures.invalidUserDto;

			const inactiveUser = userFactory.createInactive(inactiveDto);

			jest.spyOn(userFactory, 'fromDto').mockReturnValue(inactiveUser);

			mockUserRepository.create.mockResolvedValue(inactiveUser);

			const result = await service.create(inactiveDto);

			expect(userFactory.fromDto).toHaveBeenCalledWith(inactiveDto);
			expect(mockUserRepository.create).toHaveBeenCalledWith(inactiveUser);
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
