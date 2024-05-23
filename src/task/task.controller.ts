import { Controller, Get, Param } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller()
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Get('/:userid')
    getUserTasks(@Param('userid') userid: number){
        return this.taskService.getUserTasks(userid)
    }

}
