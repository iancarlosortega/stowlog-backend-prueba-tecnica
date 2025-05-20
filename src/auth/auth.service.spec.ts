import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/entities/user.entity';
import { UserFactory } from '@/users/factories/user.factory';
import { userFixtures } from '@/users/fixtures/user.fixtures';
import { AuthService } from '@/auth/auth.service';
import { LoginUserDto } from '@/auth/dtos/login-user.dto';
import { RegisterUserDto } from '@/auth/dtos/register-user.dto';
import * as passwordUtils from '@/auth/utils/password';

jest.mock('./utils/password');

describe('AuthService', () => {
	let service: AuthService;
	let usersService: UsersService;
	let jwtService: JwtService;
	let userFactory: UserFactory;
	let mockUser: User;
	let loginDto: LoginUserDto;

	const mockUsersService = {
		findByUsername: jest.fn(),
		create: jest.fn(),
		findOne: jest.fn(),
	};

	const mockJwtService = {
		sign: jest.fn(),
	};
	beforeEach(async () => {
		jest.clearAllMocks();
		userFactory = new UserFactory();
		mockUser = userFactory.createUser({
			password: 'hashedpassword',
		});

		loginDto = {
			username: mockUser.username,
			password: 'Test123!',
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{ provide: UsersService, useValue: mockUsersService },
				{ provide: JwtService, useValue: mockJwtService },
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		usersService = module.get<UsersService>(UsersService);
		jwtService = module.get<JwtService>(JwtService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
	describe('register', () => {
		const registerDto: RegisterUserDto = {
			...userFixtures.createUserDto,
			password: 'Test123!',
		};

		it('should register a new user successfully', async () => {
			mockUsersService.findByUsername.mockResolvedValue(null);
			(passwordUtils.hashPassword as jest.Mock).mockResolvedValue(
				'hashedpassword',
			);
			mockUsersService.create.mockResolvedValue(mockUser);
			mockJwtService.sign.mockReturnValue('test-token');

			const result = await service.register(registerDto);

			expect(result).toEqual({
				user: { ...mockUser, password: undefined },
				token: 'test-token',
			});
			expect(usersService.findByUsername).toHaveBeenCalledWith(
				registerDto.username,
			);
			expect(passwordUtils.hashPassword).toHaveBeenCalledWith(
				registerDto.password,
			);
			expect(usersService.create).toHaveBeenCalledWith({
				...registerDto,
				password: 'hashedpassword',
			});
			expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser.id });
		});

		it('should throw BadRequestException if username already exists', async () => {
			mockUsersService.findByUsername.mockResolvedValue(mockUser);

			await expect(service.register(registerDto)).rejects.toThrow(
				BadRequestException,
			);
			expect(usersService.findByUsername).toHaveBeenCalledWith(
				registerDto.username,
			);
		});
	});
	describe('login', () => {
		it('should login a user successfully', async () => {
			mockUsersService.findByUsername.mockResolvedValue(mockUser);
			(passwordUtils.verifyPassword as jest.Mock).mockResolvedValue(true);
			mockJwtService.sign.mockReturnValue('test-token');

			const result = await service.login(loginDto);

			expect(result).toEqual({
				user: { ...mockUser, password: undefined },
				token: 'test-token',
			});
			expect(usersService.findByUsername).toHaveBeenCalledWith(
				loginDto.username,
			);
			expect(passwordUtils.verifyPassword).toHaveBeenCalledWith(
				loginDto.password,
				mockUser.password,
			);
			expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser.id });
		});

		it('should throw NotFoundException if user not found', async () => {
			mockUsersService.findByUsername.mockResolvedValue(null);

			await expect(service.login(loginDto)).rejects.toThrow(NotFoundException);
			expect(usersService.findByUsername).toHaveBeenCalledWith(
				loginDto.username,
			);
		});
		it('should throw BadRequestException if user is inactive', async () => {
			const inactiveUser = userFactory.createInactive({
				password: mockUser.password,
			});

			mockUsersService.findByUsername.mockResolvedValue(inactiveUser);

			await expect(service.login(loginDto)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw BadRequestException if password is invalid', async () => {
			mockUsersService.findByUsername.mockResolvedValue(mockUser);
			(passwordUtils.verifyPassword as jest.Mock).mockResolvedValue(false);

			await expect(service.login(loginDto)).rejects.toThrow(
				BadRequestException,
			);
			expect(passwordUtils.verifyPassword).toHaveBeenCalledWith(
				loginDto.password,
				mockUser.password,
			);
		});
	});

	describe('refreshToken', () => {
		it('should refresh token successfully', () => {
			mockJwtService.sign.mockReturnValue('fresh-token');
			const { password, ...userWithoutPassword } = mockUser;

			const result = service.refreshToken(mockUser);

			expect(result).toEqual({
				user: userWithoutPassword,
				token: 'fresh-token',
			});
			expect(jwtService.sign).toHaveBeenCalledWith({ id: mockUser.id });
		});
	});
});
