import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Task]), TypeOrmModule.forFeature([User])],
    providers: [TaskService],
    controllers: [TaskController],
})
export class TaskModule {}
