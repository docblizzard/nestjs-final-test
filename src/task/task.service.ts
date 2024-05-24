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

    checkEmptyTaskInputandRegex(name: string, userId: string, priority: number ){

        if (name.length === 0 || !(this.uuidRegex(userId)) || isNaN(priority) || priority <= 0 ){
            return false;
        }
        else return true;
    }

    async addTask(name: string, userId: string, priority: number): Promise<Task> {
        if (!(this.checkEmptyTaskInputandRegex(name, userId, priority))) {
            throw new BadRequestException('Missing/Incorrect inputs');
        }

        else {
            const task = new Task();
            task.name = name;
            task.userId = userId;
            task.priority = priority;
            return await this.taskRepository.save(task);
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
                const foundTasks = await this.taskRepository.find({ where: { userId } });
                return foundTasks;
            }
            else {
                console.log(foundUser);
                throw new NotFoundException('User not found');
            }
        }
        else throw new BadRequestException('Incorrect userId input');
    }

    async resetData(): Promise<void>{
        const maxRetries = 5;
        let count = 0;
        const retryDelay = 1000;
        while (true) {
            try {
                return await this.taskRepository.query('TRUNCATE TABLE "task" CASCADE;');
            } catch (error) {
                if (++count === maxRetries) throw new Error('Failed to reset data: ' + error.message);
            }
        }
    }
}
