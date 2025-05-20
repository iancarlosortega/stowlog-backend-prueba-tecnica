import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { USER_REPOSITORY } from '@/users/repositories/user.repository';
import { User } from '@/users/entities/user.entity';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { generateUUID } from '@/shared/utils/uuid';

describe('UsersService', () => {
	let service: UsersService;
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
					provide: USER_REPOSITORY,
					useValue: mockUserRepository,
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		it('should create a new user', async () => {
			const createUserDto: CreateUserDto = {
				fullName: 'Ian Carlos Ortega',
				username: 'iancarlosortega',
				password: 'password123',
				email: 'iancarlosortegaleon@gmail.com',
			};

			const expectedUser: User = {
				id: generateUUID(),
				fullName: 'Ian Carlos Ortega',
				username: 'iancarlosortega',
				password: 'password123',
				email: 'iancarlosortegaleon@gmail.com',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as User;

			mockUserRepository.create.mockResolvedValue(expectedUser);

			const result = await service.create(createUserDto);

			expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
			expect(result).toEqual(expectedUser);
		});
	});

	describe('findOne', () => {
		it('should return a user if found', async () => {
			const userId = generateUUID();
			const expectedUser: User = {
				id: userId,
				fullName: 'Ian Carlos Ortega',
				username: 'iancarlosortega',
				password: 'password123',
				email: 'iancarlosortegaleon@gmail.com',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as User;

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
			const expectedUser: User = {
				id: generateUUID(),
				fullName: 'Ian Carlos Ortega',
				username,
				password: 'password123',
				email: 'iancarlosortegaleon@gmail.com',
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as User;

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
			const expectedUser: User = {
				id: generateUUID(),
				fullName: 'Ian Carlos Ortega',
				username: 'iancarlosortega',
				password: 'password123',
				email,
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as User;

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
