export class TaskCreatedEvent {
	constructor(
		public readonly taskId: string,
		public readonly userEmail: string,
		public readonly message: string,
	) {}
}
