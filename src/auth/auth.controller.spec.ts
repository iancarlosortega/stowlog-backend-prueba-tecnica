import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { LoginUserDto } from '@/auth/dtos/login-user.dto';
import { RegisterUserDto } from '@/auth/dtos/register-user.dto';
import { UserRoles } from '@/auth/constants/roles';
import { User } from '@/users/entities/user.entity';

describe('AuthController', () => {
	let controller: AuthController;
	let authService: AuthService;

	const mockAuthService = {
		register: jest.fn(),
		login: jest.fn(),
		refreshToken: jest.fn(),
	};

	const mockUser: User = {
		id: 'testid',
		fullName: 'Ian Carlos Ortega',
		username: 'iancarlosortega',
		email: 'iancarlosortegaleon@gmail.com',
		password: 'strongpassword',
		role: UserRoles.USER,
		isActive: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const authResponseMock = {
		user: { ...mockUser, password: undefined },
		token: 'test-jwt-token',
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				PassportModule.register({
					defaultStrategy: 'jwt',
				}),
			],
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: mockAuthService,
				},
			],
		}).compile();

		controller = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should register a new user successfully', async () => {
		const registerDto: RegisterUserDto = {
			fullName: 'Ian Carlos Ortega',
			username: 'iancarlosortega',
			email: 'iancarlosortegaleon@gmail.com',
			password: 'Test123!',
		};

		mockAuthService.register.mockResolvedValue(authResponseMock);

		const result = await controller.register(registerDto);

		expect(result).toEqual(authResponseMock);
		expect(authService.register).toHaveBeenCalledWith(registerDto);
	});

	it('should login a user successfully', async () => {
		const loginDto: LoginUserDto = {
			username: 'iancarlosortega',
			password: 'Test123!',
		};

		mockAuthService.login.mockResolvedValue(authResponseMock);

		const result = await controller.login(loginDto);

		expect(result).toEqual(authResponseMock);
		expect(authService.login).toHaveBeenCalledWith(loginDto);
	});

	it('should refresh token successfully', async () => {
		mockAuthService.refreshToken.mockReturnValue(authResponseMock);

		const result = controller.refreshToken(mockUser);

		expect(result).toEqual(authResponseMock);
		expect(authService.refreshToken).toHaveBeenCalledWith(mockUser);
	});

	it('should return correct admin string', () => {
		const adminUser = { ...mockUser, role: UserRoles.ADMIN };

		const result = controller.onlyAdmin(adminUser);

		expect(result).toBe(
			`You are an admin: ${adminUser.username} and your role is ${adminUser.role}`,
		);
	});
});
