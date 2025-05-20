import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthService } from '@/health/health.service';
import { HealthController } from '@/health/health.controller';

@Module({
	imports: [TypeOrmModule.forFeature()],
	controllers: [HealthController],
	providers: [HealthService],
})
export class HealthModule {}
