import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@/tasks/entities/task.entity';
import { TaskRepository } from '@/tasks/repositories/task.repository';

@Injectable()
export class TaskRepositoryTypeOrm implements TaskRepository {
	constructor(
		@InjectRepository(Task)
		private readonly repository: Repository<Task>,
	) {}

	async create(task: Partial<Task>): Promise<Task> {
		const newTask = this.repository.create(task);
		return await this.repository.save(newTask);
	}

	async update(id: string, task: Partial<Task>): Promise<Task | null> {
		await this.repository.update(id, task);
		return this.findById(id);
	}

	async delete(id: string): Promise<void> {
		await this.repository.delete(id);
	}

	async findById(id: string): Promise<Task | null> {
		return await this.repository.findOneBy({ id });
	}
}
