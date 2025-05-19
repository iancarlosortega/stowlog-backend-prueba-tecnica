import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '@/tasks/entities/task.entity';

import { TASK_REPOSITORY } from '@/tasks/repositories/task.repository';
import { TaskRepositoryTypeOrm } from '@/tasks/repositories/task.repository.impl';
import { TaskRepositoryInMemory } from '@/tasks/repositories/task.repository.memory';

import { TasksService } from '@/tasks/tasks.service';
import { TasksController } from '@/tasks/tasks.controller';

@Module({
	controllers: [TasksController],
	providers: [
		TasksService,
		{
			provide: TASK_REPOSITORY,
			useClass:
				process.env.NODE_ENV === 'test'
					? TaskRepositoryInMemory
					: TaskRepositoryTypeOrm,
		},
	],
	imports: [TypeOrmModule.forFeature([Task])],
	exports: [TasksService],
})
export class TasksModule {}
