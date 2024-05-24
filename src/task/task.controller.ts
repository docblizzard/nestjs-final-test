import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';

@Controller()
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Get('/user/:userid')
    async getUserTasks(@Param('userid') userid: string){
        return await this.taskService.getUserTasks(userid)
    }

    @Get('/:name')
    async getTasks(@Param('name') name: string) {
        return await this.taskService.getTaskByName(name)
    }

    @Post()
    async createTask(@Body() task: Task): Promise<Task> {
        return await this.taskService.addTask(task.name, task.userId, task.priority);
    }
    //Don't push to prod
    @Delete('delete')
    async deleteTasks(){
        return await this.taskService.resetData()
    }
    
}