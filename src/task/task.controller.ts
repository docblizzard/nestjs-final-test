import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';

@Controller()
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Get('/:userid')
    getUserTasks(@Param('userid') userid: number){
        return this.taskService.getUserTasks(userid)
    }

    @Post()
    createTask(@Body() task: Task): Promise<Task> {
        return this.taskService.addTask(task.name, task.userId, task.priority);
    }
}
