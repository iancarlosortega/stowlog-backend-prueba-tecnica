export interface NotificationStrategy {
	send(recipient: string, message: string): Promise<void>;
}
