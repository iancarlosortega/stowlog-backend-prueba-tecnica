import { Injectable } from '@nestjs/common';
import { Task } from '@/tasks/entities/task.entity';
import { TaskRepository } from '@/tasks/repositories/task.repository';

@Injectable()
export class TaskRepositoryInMemory implements TaskRepository {
	private tasks: Task[] = [];

	async create(task: Partial<Task>): Promise<Task> {
		const newTask = { ...task } as Task;
		this.tasks.push(newTask);
		return newTask;
	}

	async update(id: string, task: Partial<Task>): Promise<Task | null> {
		const index = this.tasks.findIndex((t) => t.id === id);
		if (index === -1) return null;
		this.tasks[index] = { ...this.tasks[index], ...task };
		return this.tasks[index];
	}

	async delete(id: string): Promise<void> {
		this.tasks = this.tasks.filter((t) => t.id !== id);
	}

	async findById(id: string): Promise<Task | null> {
		return this.tasks.find((t) => t.id === id) || null;
	}
}
