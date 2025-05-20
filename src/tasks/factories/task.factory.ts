import { Injectable } from '@nestjs/common';
import { Task } from '@/tasks/entities/task.entity';
import { CreateTaskDto } from '@/tasks/dtos/create-task.dto';
import { generateUUID } from '@/shared/utils/uuid';

@Injectable()
export class TaskFactory {
	createTask(createTaskDto: CreateTaskDto): Task {
		const newTask = new Task();

		newTask.id = generateUUID();
		newTask.title = createTaskDto.title;
		newTask.description = createTaskDto.description || '';

		newTask.completed = false;
		newTask.createdAt = new Date();
		newTask.updatedAt = new Date();

		return newTask;
	}
}
