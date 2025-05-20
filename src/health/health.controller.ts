import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from '@/health/health.service';
import { HealthCheckResponse } from '@/health/interfaces/health-check.response';

@ApiTags('health')
@Controller('health')
export class HealthController {
	constructor(private readonly healthService: HealthService) {}

	@Get()
	@ApiOperation({ summary: 'Check the health of the application' })
	@ApiResponse({
		status: 200,
		description: 'Application is healthy',
	})
	@ApiResponse({
		status: 503,
		description: 'Application is unhealthy',
	})
	checkHealth(): Promise<HealthCheckResponse> {
		return this.healthService.checkHealth();
	}
}
