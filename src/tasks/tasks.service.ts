import {
	Injectable,
	Inject,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { Task } from '@/tasks/entities/task.entity';
import {
	TASK_REPOSITORY,
	TaskRepository,
} from '@/tasks/repositories/task.repository';
import { CreateTaskDto } from '@/tasks/dtos/create-task.dto';

@Injectable()
export class TasksService {
	constructor(
		@Inject(TASK_REPOSITORY)
		private readonly taskRepository: TaskRepository,
	) {}

	async getTaskById(id: string): Promise<Task> {
		const task = await this.taskRepository.findById(id);
		if (!task) throw new NotFoundException(`Task ${id} not found`);
		return task;
	}

	async createTask(data: CreateTaskDto): Promise<Task> {
		return this.taskRepository.create(data);
	}

	async updateTask(id: string, data: Partial<Task>): Promise<Task> {
		try {
			const updatedTask = await this.taskRepository.update(id, data);

			if (!updatedTask) {
				throw new NotFoundException(`Task ${id} not found`);
			}

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
