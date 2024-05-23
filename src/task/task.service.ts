import { BadRequestException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>
    ) {}
    
    uuidRegex(uuid: string) {
        const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
        return uuidRegex.test(uuid);
    }

    checkEmptyTaskInputandRegex(name: string, userId: string, priority: string ){
        const priorityToNum = parseFloat(priority)

        if (name.length === 0 || !(this.uuidRegex(userId)) || isNaN(priorityToNum) || priorityToNum <= 0 ){
            return false
        }
        else return true
    }

    async addTask(name: string, userId: string, priority: string): Promise<Task> {
        
        if (!(this.checkEmptyTaskInputandRegex(name, userId, priority))) {
            throw new BadRequestException('Missing/Incorrect inputs');
        }
        else {
            const task = new Task()
            task.name = name;
            task.userId = userId;
            task.priority = priority
            return this.taskRepository.save(task)
        }
    }

    getTaskByName(name: string): Promise<unknown> {
        throw new NotImplementedException();
    }

    async getUserTasks(userId: string): Promise<Task[]> {
        if (this.uuidRegex(userId)){
            const foundUser = await this.userRepository.findOne({ where: { id: userId } });
            if (foundUser) {
                const foundTasks = await this.taskRepository.find({ where: { userId } })
                return foundTasks
            }
            else throw new NotFoundException('User not found')
        }
        else throw new BadRequestException('Incorrect userId input')
    }

    async resetData(): Promise<void> {
        try {
            await this.taskRepository.clear();
          } catch (error) {
            throw new Error('Failed to reset data: ' + error.message);
          }
    }
}
