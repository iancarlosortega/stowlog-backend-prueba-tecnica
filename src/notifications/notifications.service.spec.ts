import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { NotificationsService } from '@/notifications/notifications.service';
import { Notification } from '@/notifications/entities/notification.entity';
import { CreateNotificationDto } from '@/notifications/dtos/create-notification.dto';
import { generateUUID } from '@/shared/utils/uuid';

describe('NotificationsService', () => {
	let service: NotificationsService;
	let repository: Repository<Notification>;

	const mockNotification = {
		id: generateUUID(),
		type: 'success',
		message: 'A new task has been created',
		userId: generateUUID(),
		isRead: false,
		createdAt: new Date(),
	};

	const mockNotificationRepository = {
		create: jest.fn(),
		save: jest.fn(),
	};

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				NotificationsService,
				{
					provide: getRepositoryToken(Notification),
					useValue: mockNotificationRepository,
				},
			],
		}).compile();

		service = module.get<NotificationsService>(NotificationsService);
		repository = module.get<Repository<Notification>>(
			getRepositoryToken(Notification),
		);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		it('should create a new notification successfully', async () => {
			const createNotificationDto: CreateNotificationDto = {
				message: 'A new task has been created',
				userId: generateUUID(),
			};

			mockNotificationRepository.create.mockReturnValue(mockNotification);
			mockNotificationRepository.save.mockResolvedValue(mockNotification);

			const result = await service.create(createNotificationDto);

			expect(result).toEqual(mockNotification);
			expect(repository.create).toHaveBeenCalledWith(createNotificationDto);
			expect(repository.save).toHaveBeenCalledWith(mockNotification);
		});

		it('should throw BadRequestException when creating a notification fails', async () => {
			const createNotificationDto: CreateNotificationDto = {
				message: 'A new task has been created',
				userId: generateUUID(),
			};

			const errorMessage = 'Error creating notification';
			mockNotificationRepository.create.mockReturnValue(mockNotification);
			mockNotificationRepository.save.mockRejectedValue(
				new BadRequestException(errorMessage),
			);

			await expect(service.create(createNotificationDto)).rejects.toThrow(
				BadRequestException,
			);
			expect(repository.create).toHaveBeenCalledWith(createNotificationDto);
			expect(repository.save).toHaveBeenCalledWith(mockNotification);
		});
	});
});
