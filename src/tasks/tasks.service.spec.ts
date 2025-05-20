import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
	NotFoundException,
	InternalServerErrorException,
} from '@nestjs/common';
import { TasksService } from '@/tasks/tasks.service';
import { TASK_REPOSITORY } from '@/tasks/repositories/task.repository';
import { TaskFactory } from '@/tasks/factories/task.factory';
import { Task } from '@/tasks/entities/task.entity';
import { CreateTaskDto } from '@/tasks/dtos/create-task.dto';
import { UpdateTaskDto } from '@/tasks/dtos/update-task.dto';
import { TaskCreatedEvent } from '@/tasks/events/task-created.event';
import { TaskCompletedEvent } from '@/tasks/events/task-completed.event';
import { generateUUID } from '@/shared/utils/uuid';

describe('TasksService', () => {
	let service: TasksService;
	let taskRepository: any;
	let eventEmitter: EventEmitter2;
	let taskFactory: TaskFactory;

	const mockTask: Task = {
		id: 'task-uuid',
		title: 'Test Task',
		description: 'Test Description',
		completed: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const mockTaskRepository = {
		findById: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};

	const mockEventEmitter = {
		emit: jest.fn(),
	};

	const mockTaskFactory = {
		createTask: jest.fn(),
	};

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TasksService,
				{
					provide: TASK_REPOSITORY,
					useValue: mockTaskRepository,
				},
				{
					provide: EventEmitter2,
					useValue: mockEventEmitter,
				},
				{
					provide: TaskFactory,
					useValue: mockTaskFactory,
				},
			],
		}).compile();

		service = module.get<TasksService>(TasksService);
		taskRepository = module.get(TASK_REPOSITORY);
		eventEmitter = module.get<EventEmitter2>(EventEmitter2);
		taskFactory = module.get<TaskFactory>(TaskFactory);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getTaskById', () => {
		it('should return a task by id', async () => {
			mockTaskRepository.findById.mockResolvedValue(mockTask);

			const result = await service.getTaskById(mockTask.id);

			expect(result).toEqual(mockTask);
			expect(taskRepository.findById).toHaveBeenCalledWith(mockTask.id);
		});

		it('should throw NotFoundException if task not found', async () => {
			mockTaskRepository.findById.mockResolvedValue(null);

			await expect(service.getTaskById('non-existent-id')).rejects.toThrow(
				NotFoundException,
			);
			expect(taskRepository.findById).toHaveBeenCalledWith('non-existent-id');
		});
	});

	describe('createTask', () => {
		it('should create a task successfully', async () => {
			const createTaskDto: CreateTaskDto = {
				title: 'New Task',
				description: 'Task Description',
			};
			const userEmail = 'test@example.com';

			mockTaskFactory.createTask.mockReturnValue(mockTask);
			mockTaskRepository.create.mockResolvedValue(mockTask);

			const result = await service.createTask(userEmail, createTaskDto);

			expect(result).toEqual(mockTask);
			expect(taskFactory.createTask).toHaveBeenCalledWith(createTaskDto);
			expect(taskRepository.create).toHaveBeenCalledWith(mockTask);
			expect(eventEmitter.emit).toHaveBeenCalledWith(
				'task.created',
				expect.any(TaskCreatedEvent),
			);
		});
	});

	describe('updateTask', () => {
		it('should update a task successfully', async () => {
			const updateTaskDto: UpdateTaskDto = {
				title: 'Updated Task',
				completed: true,
			};
			const userId = 'user-uuid';
			const updatedTask = { ...mockTask, ...updateTaskDto };

			mockTaskRepository.update.mockResolvedValue(updatedTask);

			const result = await service.updateTask(
				userId,
				mockTask.id,
				updateTaskDto,
			);

			expect(result).toEqual(updatedTask);
			expect(taskRepository.update).toHaveBeenCalledWith(
				mockTask.id,
				updateTaskDto,
			);
			expect(eventEmitter.emit).toHaveBeenCalledWith(
				'task.completed',
				expect.any(TaskCompletedEvent),
			);
		});

		it('should throw NotFoundException if task not found during update', async () => {
			const updateTaskDto: UpdateTaskDto = {
				title: 'Updated Task',
			};
			const userId = generateUUID();

			mockTaskRepository.update.mockResolvedValue(null);

			await expect(
				service.updateTask(userId, 'non-existent-id', updateTaskDto),
			).rejects.toThrow(NotFoundException);
		});

		it('should handle errors and throw InternalServerErrorException', async () => {
			const updateTaskDto: UpdateTaskDto = {
				title: 'Updated Task',
			};
			const userId = generateUUID();

			mockTaskRepository.update.mockRejectedValue(new Error('Database error'));

			await expect(
				service.updateTask(userId, mockTask.id, updateTaskDto),
			).rejects.toThrow(InternalServerErrorException);
		});
	});

	describe('deleteTask', () => {
		it('should delete a task successfully', async () => {
			mockTaskRepository.findById.mockResolvedValue(mockTask);
			mockTaskRepository.delete.mockResolvedValue(undefined);

			await service.deleteTask(mockTask.id);

			expect(taskRepository.findById).toHaveBeenCalledWith(mockTask.id);
			expect(taskRepository.delete).toHaveBeenCalledWith(mockTask.id);
		});

		it('should throw NotFoundException if task to delete is not found', async () => {
			mockTaskRepository.findById.mockResolvedValue(null);

			await expect(service.deleteTask('non-existent-id')).rejects.toThrow(
				NotFoundException,
			);
			expect(taskRepository.findById).toHaveBeenCalledWith('non-existent-id');
			expect(taskRepository.delete).not.toHaveBeenCalled();
		});
	});
});
