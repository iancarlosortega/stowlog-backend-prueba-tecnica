// src/notifications/strategies/internal-message-notification.strategy.ts
import { Injectable } from '@nestjs/common';
import { NotificationStrategy } from './notification.strategy';

@Injectable()
export class InternalMessageNotificationStrategy
	implements NotificationStrategy
{
	async send(recipient: string, message: string): Promise<void> {
		// Simula guardar en base de datos o emitir por WebSocket
		console.log(`Guardando mensaje interno para ${recipient}: ${message}`);
	}
}
