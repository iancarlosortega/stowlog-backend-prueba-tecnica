import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '@/tasks/tasks.controller';
import { TasksService } from '@/tasks/tasks.service';
import { CreateTaskDto } from '@/tasks/dtos/create-task.dto';
import { UpdateTaskDto } from '@/tasks/dtos/update-task.dto';
import { Task } from '@/tasks/entities/task.entity';
import { generateUUID } from '@/shared/utils/uuid';

jest.mock('@/auth/decorators/auth.decorator', () => ({
	Auth: () => jest.fn(),
}));

jest.mock('@/auth/decorators/get-user.decorator', () => ({
	GetUser: () => jest.fn(),
}));

describe('TasksController', () => {
	let controller: TasksController;
	let tasksService: TasksService;

	const mockTask: Task = {
		id: generateUUID(),
		title: 'Test Task',
		description: 'Test Description',
		completed: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const mockTasksService = {
		createTask: jest.fn(),
		getTaskById: jest.fn(),
		updateTask: jest.fn(),
		deleteTask: jest.fn(),
	};
	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [TasksController],
			providers: [
				{
					provide: TasksService,
					useValue: mockTasksService,
				},
			],
		}).compile();

		controller = module.get<TasksController>(TasksController);
		tasksService = module.get<TasksService>(TasksService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should create a new task', async () => {
		const createTaskDto: CreateTaskDto = {
			title: 'New Task',
			description: 'Task Description',
		};
		const userEmail = 'test@example.com';

		mockTasksService.createTask.mockResolvedValue(mockTask);

		const result = await controller.create(createTaskDto, userEmail);

		expect(result).toEqual(mockTask);
		expect(tasksService.createTask).toHaveBeenCalledWith(
			userEmail,
			createTaskDto,
		);
	});

	it('should return a task by id', async () => {
		const taskId = generateUUID();

		mockTasksService.getTaskById.mockResolvedValue(mockTask);

		const result = await controller.findOne(taskId);

		expect(result).toEqual(mockTask);
		expect(tasksService.getTaskById).toHaveBeenCalledWith(taskId);
	});

	it('should update a task', async () => {
		const taskId = generateUUID();
		const userId = generateUUID();
		const updateTaskDto: UpdateTaskDto = {
			title: 'Updated Task',
			completed: true,
		};
		const updatedTask = { ...mockTask, ...updateTaskDto };

		mockTasksService.updateTask.mockResolvedValue(updatedTask);

		const result = await controller.update(taskId, updateTaskDto, userId);

		expect(result).toEqual(updatedTask);
		expect(tasksService.updateTask).toHaveBeenCalledWith(
			userId,
			taskId,
			updateTaskDto,
		);
	});

	it('should delete a task', async () => {
		const taskId = generateUUID();
		mockTasksService.deleteTask.mockResolvedValue(undefined);
		await controller.remove(taskId);
		expect(tasksService.deleteTask).toHaveBeenCalledWith(taskId);
	});
});
