import { Injectable } from '@nestjs/common';
import * as os from 'os';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { HealthCheckResponse } from '@/health/interfaces/health-check.response';
import { formatBytes, formatUptime } from '@/shared/utils/format';

@Injectable()
export class HealthService {
	constructor(
		private configService: ConfigService,
		private dataSource: DataSource,
	) {}

	async checkHealth(): Promise<HealthCheckResponse> {
		const startTime = Date.now();
		const response: HealthCheckResponse = {
			status: 'OK',
			timestamp: new Date().toISOString(),
			uptime: formatUptime(process.uptime()),
			version: process.env.npm_package_version || 'unknown',
			environment: this.configService.get<string>('environment') || 'unknown',
			services: {
				database: { status: 'unknown' },
			},
			system: {
				freeMem: formatBytes(os.freemem()),
				totalMem: formatBytes(os.totalmem()),
				usedMem: formatBytes(os.totalmem() - os.freemem()),
				cpuLoad: os.loadavg(),
				uptime: formatUptime(os.uptime()),
			},
		};

		response.services.database = await this.checkDatabaseConnection();
		if (response.services.database.status === 'down') {
			response.status = 'DEGRADED';
		}

		const responseTime = this.calculateResponseTime(startTime);

		return {
			...response,
			responseTime,
		};
	}

	private async checkDatabaseConnection(): Promise<{
		status: string;
		message?: string;
	}> {
		try {
			await this.dataSource.query('SELECT 1');
			return { status: 'up' };
		} catch (error) {
			return {
				status: 'down',
				message: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	private calculateResponseTime(startTime: number): string {
		const responseTime = Date.now() - startTime;
		return `${responseTime}ms`;
	}
}
