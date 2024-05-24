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
    
    checkUserUuid(uuid: string) {
        
    }

    uuidRegex(uuid: string) {
        const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
        return uuidRegex.test(uuid);
    }

    checkEmptyTaskInputandRegex(name: string, userId: string, priority: string ){
        const priorityToNum = parseFloat(priority);

        if (name.length === 0 || !(this.uuidRegex(userId)) || isNaN(priorityToNum) || priorityToNum <= 0 ){
            return false;
        }
        else return true;
    }

    async addTask(name: string, userId: string, priority: string | number): Promise<Task> {
        //Check if userId for the task exists, avoids foreign key errors
        // const foundUser = await this.userRepository.findOne({ where: { id: userId } });
        const priorityConverted = priority.toString();
        
        // if (!foundUser){
        //     throw new BadRequestException('UserId does not exist');
        // }
        if (!(this.checkEmptyTaskInputandRegex(name, userId, priorityConverted))) {
            throw new BadRequestException('Missing/Incorrect inputs');
        }

        const foundUser = await this.userRepository.findOne({ where: { id: userId } });
        if (!foundUser) {
            throw new BadRequestException('UserId does not exist');
        }

        else {
            const task = new Task();
            task.name = name;
            task.userId = userId;
            task.priority = priorityConverted;
            return this.taskRepository.save(task);
        }
    }

    async getTaskByName(name: string): Promise<Task> {
        const foundTask = await this.taskRepository.findOne({where: {name: name} })
        if (foundTask) {
            return foundTask;
        }
        else throw new NotFoundException('Tasks not found with this name');
    }

    async getUserTasks(userId: string): Promise<Task[]> {
        if (this.uuidRegex(userId)){
            const foundUser = await this.userRepository.findOne({ where: { id: userId } });
            if (foundUser) {
                const foundTasks = await this.taskRepository.find({ where: { userId } })
                return foundTasks;
            }
            else throw new NotFoundException('User not found');
        }
        else throw new BadRequestException('Incorrect userId input');
    }

    async resetData(): Promise<void> {
        try {
            await this.taskRepository.clear();
        } catch (error) {
            throw new Error('Failed to reset data: ' + error.message);
        }
    }
}
