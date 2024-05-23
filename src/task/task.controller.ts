import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';

@Controller()
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Get('/user/:userid')
    getUserTasks(@Param('userid') userid: string){
        return this.taskService.getUserTasks(userid)
    }

    @Post()
    createTask(@Body() task: Task): Promise<Task> {
        return this.taskService.addTask(task.name, task.userId, task.priority);
    }
    //Don't push to prod
    @Delete('delete')
    deleteTasks(){
        return this.taskService.resetData()
    }
}