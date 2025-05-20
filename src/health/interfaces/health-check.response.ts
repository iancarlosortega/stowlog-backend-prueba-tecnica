export interface HealthCheckResponse {
	status: string;
	timestamp: string;
	uptime: string;
	version: string;
	environment: string;
	services: {
		database: {
			status: string;
			message?: string;
		};
	};
	system: {
		freeMem: string;
		totalMem: string;
		usedMem: string;
		cpuLoad: number[];
		uptime: string;
	};
	responseTime?: string;
}
