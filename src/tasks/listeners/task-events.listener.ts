import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskCreatedEvent } from '@/tasks/events/task-created.event';
import { TaskCompletedEvent } from '@/tasks/events/task-completed.event';
import { EmailNotificationStrategy } from '@/notifications/strategies/email-notification.strategy';
import { InternalMessageNotificationStrategy } from '@/notifications/strategies/internal-message-notification.strategy';

@Injectable()
export class TaskEventsListener {
	constructor(
		private readonly emailStrategy: EmailNotificationStrategy,
		private readonly internalStrategy: InternalMessageNotificationStrategy,
	) {}

	@OnEvent('task.created')
	async handleTaskCreated(event: TaskCreatedEvent) {
		await this.emailStrategy.send(event.userId, event.message);
	}

	@OnEvent('task.completed')
	async handleTaskCompleted(event: TaskCompletedEvent) {
		await this.internalStrategy.send(event.userId, event.message);
	}
}
