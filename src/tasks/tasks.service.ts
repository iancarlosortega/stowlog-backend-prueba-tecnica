import {
	Injectable,
	Inject,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Task } from '@/tasks/entities/task.entity';
import {
	TASK_REPOSITORY,
	TaskRepository,
} from '@/tasks/repositories/task.repository';
import { CreateTaskDto } from '@/tasks/dtos/create-task.dto';
import { TaskCreatedEvent } from '@/tasks/events/task-created.event';
import { TaskCompletedEvent } from '@/tasks/events/task-completed.event';
import { TaskFactory } from '@/tasks/factories/task.factory';

@Injectable()
export class TasksService {
	constructor(
		@Inject(TASK_REPOSITORY)
		private readonly taskRepository: TaskRepository,
		private eventEmitter: EventEmitter2,
		private readonly taskFactory: TaskFactory,
	) {}

	async getTaskById(id: string): Promise<Task> {
		const task = await this.taskRepository.findById(id);
		if (!task) throw new NotFoundException(`Task ${id} not found`);
		return task;
	}

	async createTask(userEmail: string, data: CreateTaskDto): Promise<Task> {
		const newTask = this.taskFactory.createTask(data);
		const task = await this.taskRepository.create(newTask);

		this.eventEmitter.emit(
			'task.created',
			new TaskCreatedEvent(task.id, userEmail, 'New task created'),
		);

		return task;
	}

	async updateTask(
		userId: string,
		id: string,
		data: Partial<Task>,
	): Promise<Task> {
		try {
			const updatedTask = await this.taskRepository.update(id, data);

			if (!updatedTask) {
				throw new NotFoundException(`Task ${id} not found`);
			}

			this.eventEmitter.emit(
				'task.completed',
				new TaskCompletedEvent(
					updatedTask.id,
					userId,
					'Your task has been completed',
				),
			);

			return updatedTask;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}

			throw new InternalServerErrorException(
				`Failed to update task ${id}: ${error.message}`,
			);
		}
	}

	async deleteTask(id: string): Promise<void> {
		await this.getTaskById(id);
		return this.taskRepository.delete(id);
	}
}
