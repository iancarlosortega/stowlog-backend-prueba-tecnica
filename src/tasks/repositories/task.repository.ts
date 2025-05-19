import { Task } from '@/tasks/entities/task.entity';

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');

export interface TaskRepository {
	create(task: Partial<Task>): Promise<Task>;
	update(id: string, task: Partial<Task>): Promise<Task | null>;
	delete(id: string): Promise<void>;
	findById(id: string): Promise<Task | null>;
}
