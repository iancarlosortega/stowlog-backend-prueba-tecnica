import {
	Controller,
	Post,
	Get,
	Patch,
	Delete,
	Param,
	Body,
	ParseUUIDPipe,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiParam,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { Auth } from '@/auth/decorators/auth.decorator';
import { GetUser } from '@/auth/decorators/get-user.decorator';
import { CreateTaskDto } from '@/tasks/dtos/create-task.dto';
import { UpdateTaskDto } from '@/tasks/dtos/update-task.dto';
import { Task } from '@/tasks/entities/task.entity';
import { TasksService } from '@/tasks/tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
	constructor(private readonly taskService: TasksService) {}

	@Post()
	@Auth()
	@ApiOperation({ summary: 'Create a new task' })
	@ApiBearerAuth('access-token')
	@ApiResponse({
		status: 201,
		description: 'Task created successfully',
		type: Task,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad Request - Invalid task data',
	})
	create(
		@Body() createTaskDto: CreateTaskDto,
		@GetUser('email') userEmail: string,
	): Promise<Task> {
		return this.taskService.createTask(userEmail, createTaskDto);
	}

	@Get(':id')
	@Auth()
	@ApiOperation({ summary: 'Get a task by ID' })
	@ApiBearerAuth('access-token')
	@ApiParam({
		name: 'id',
		description: 'Task ID',
		type: 'string',
		format: 'uuid',
	})
	@ApiResponse({
		status: 200,
		description: 'Task retrieved successfully',
		type: Task,
	})
	@ApiResponse({ status: 404, description: 'Task not found' })
	findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
		return this.taskService.getTaskById(id);
	}

	@Patch(':id')
	@Auth()
	@ApiOperation({ summary: 'Update a task' })
	@ApiBearerAuth('access-token')
	@ApiParam({
		name: 'id',
		description: 'Task ID',
		type: 'string',
		format: 'uuid',
	})
	@ApiResponse({
		status: 200,
		description: 'Task updated successfully',
		type: Task,
	})
	@ApiResponse({ status: 404, description: 'Task not found' })
	@ApiResponse({
		status: 400,
		description: 'Bad Request - Invalid update data',
	})
	update(
		@Param('id', ParseUUIDPipe) taskId: string,
		@Body() updateTaskDto: UpdateTaskDto,
		@GetUser('id') userId: string,
	): Promise<Task> {
		return this.taskService.updateTask(userId, taskId, updateTaskDto);
	}

	@Delete(':id')
	@Auth()
	@ApiOperation({ summary: 'Delete a task' })
	@ApiBearerAuth('access-token')
	@ApiParam({
		name: 'id',
		description: 'Task ID',
		type: 'string',
		format: 'uuid',
	})
	@ApiResponse({
		status: 200,
		description: 'Task deleted successfully',
	})
	@ApiResponse({ status: 404, description: 'Task not found' })
	remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		return this.taskService.deleteTask(id);
	}
}
