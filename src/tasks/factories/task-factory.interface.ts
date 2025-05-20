import { Task } from '@/tasks/entities/task.entity';
import { CreateTaskDto } from '@/tasks/dtos/create-task.dto';

export interface ITaskFactory {
	createTask(createTaskDto: CreateTaskDto): Task;
}
