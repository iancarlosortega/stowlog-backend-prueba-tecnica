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
import { CreateTaskDto } from '@/tasks/dtos/create-task.dto';
import { UpdateTaskDto } from '@/tasks/dtos/update-task.dto';
import { Task } from '@/tasks/entities/task.entity';
import { TasksService } from '@/tasks/tasks.service';

@Controller('tasks')
export class TasksController {
	constructor(private readonly taskService: TasksService) {}

	@Post()
	create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
		return this.taskService.createTask(createTaskDto);
	}

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
		return this.taskService.getTaskById(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateTaskDto: UpdateTaskDto,
	): Promise<Task> {
		return this.taskService.updateTask(id, updateTaskDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
		return this.taskService.deleteTask(id);
	}
}
