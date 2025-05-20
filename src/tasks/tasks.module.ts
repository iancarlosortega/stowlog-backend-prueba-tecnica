import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { NotificationsModule } from '@/notifications/notifications.module';

import { TASK_REPOSITORY } from '@/tasks/repositories/task.repository';
import { TaskRepositoryTypeOrm } from '@/tasks/repositories/task.repository.typeorm';
import { TaskRepositoryInMemory } from '@/tasks/repositories/task.repository.memory';

import { Task } from '@/tasks/entities/task.entity';
import { TaskEventsListener } from '@/tasks/listeners/task-events.listener';
import { TasksService } from '@/tasks/tasks.service';
import { TasksController } from '@/tasks/tasks.controller';
import { TaskFactory } from '@/tasks/factories/task.factory';

@Module({
	controllers: [TasksController],
	providers: [
		TasksService,
		TaskEventsListener,
		TaskFactory,
		{
			provide: TASK_REPOSITORY,
			useClass:
				process.env.ENVIRONMENT === 'TESTING'
					? TaskRepositoryInMemory
					: TaskRepositoryTypeOrm,
		},
	],
	imports: [TypeOrmModule.forFeature([Task]), AuthModule, NotificationsModule],
	exports: [TasksService],
})
export class TasksModule {}
