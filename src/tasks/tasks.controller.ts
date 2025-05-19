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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateTaskDto } from '@/tasks/dtos/create-task.dto';
import { UpdateTaskDto } from '@/tasks/dtos/update-task.dto';
import { Task } from '@/tasks/entities/task.entity';
import { TasksService } from '@/tasks/tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
	constructor(private readonly taskService: TasksService) {}

	@Post()
	@ApiOperation({ summary: 'Create a new task' })
	@ApiResponse({
		status: 201,
		description: 'Task created successfully',
		type: Task,
	})
	@ApiResponse({ status: 400, description: 'Bad Request - Invalid task data' })
	create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
		return this.taskService.createTask(createTaskDto);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a task by ID' })
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
	@ApiOperation({ summary: 'Update a task' })
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
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateTaskDto: UpdateTaskDto,
	): Promise<Task> {
		return this.taskService.updateTask(id, updateTaskDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a task' })
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
