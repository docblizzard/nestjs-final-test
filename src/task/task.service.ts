import { BadRequestException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>
    ) {}

    async addTask(name: string, userId: number, priority: number): Promise<Task> {
        
        if (!(typeof userId === 'number') || userId < 0) {
            throw new BadRequestException('Incorrect id input');
        }
        else {
            const task = new Task()
            task.name = name;
            task.userId = Number(userId);
            task.priority = priority
            return task
        }
    }

    getTaskByName(name: string): Promise<unknown> {
        throw new NotImplementedException();
    }

    async getUserTasks(userId: number): Promise<Task[]> {
        console.log(userId)
        const foundUser = await this.userRepository.findOne({ where: { id: userId } });
        if (foundUser) {
            const foundTasks = await this.taskRepository.find({ where: { userId } })
            return foundTasks
        }
        else throw new NotFoundException('User not found')
    }

    resetData(): Promise<void> {
        throw new NotImplementedException();
    }
}
