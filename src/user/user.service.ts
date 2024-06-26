import { BadRequestException, ConflictException, Injectable, NotFoundException, NotImplementedException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';


@Injectable()
export class UserService {
    constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    ) {}

    isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9_]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    async addUser(email: string): Promise<User> {
        if (this.isValidEmail(email)) {
            const existingUser = await this.userRepository.findOne({ where: { email } });
            if (existingUser) {
                throw new ConflictException('Email already exists');
            }
            else {
                const user = new User();
                user.email = email;
                return await this.userRepository.save(user);
            }
        }
        else {
            throw new BadRequestException('Invalid email format');
        }
    }

    async getUser(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user){
            return user;
        }
        else throw new NotFoundException(`User with email ${email} not found`);
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async resetData(): Promise<void> {
        const maxRetries = 5;
        let count = 0;
        while (true) {
            try {
                return await this.userRepository.query('TRUNCATE TABLE "user" CASCADE;');
            } catch (error) {
                if (++count === maxRetries) throw new Error('Failed to reset data: ' + error.message);
            }
        }
    }
}
